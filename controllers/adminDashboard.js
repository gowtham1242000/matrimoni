const User = require("../models/User");
const FilterMaster = require("../models/FilterMaster");
const os = require("os");
const { exec } = require("child_process");
const mongoose = require("mongoose");

exports.getDashboardOverView = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    // Active users
    const activeUsers = await User.countDocuments({ isActive: true });

    // New signups in last 24 hours
    const newSignups = await User.find({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    }).select("name email createdAt");

    const reportedUsers = 30;

    // Registration trends (last 30 days)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const registrationTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // sort by date ascending
    ]);

    res.json({
      success: true,
      totalUsers,
      activeUsers,
      newSignups: {
        count: newSignups.length,
        users: newSignups,
      },
      reportedUsers,
      registrationTrends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard overview",
      error: error.message,
    });
  }
};

exports.getSystemHealth = async (req, res) => {
  try {
    // CPU usage
    const cpuLoad = os.loadavg(); // [1 min, 5 min, 15 min avg]

    // Memory usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsage = {
      total: (totalMem / 1024 ** 3).toFixed(2) + " GB",
      used: (usedMem / 1024 ** 3).toFixed(2) + " GB",
      free: (freeMem / 1024 ** 3).toFixed(2) + " GB",
      usagePercent: ((usedMem / totalMem) * 100).toFixed(2) + "%",
    };

    // Disk space (Linux command "df -h /")
    const diskUsage = await new Promise((resolve, reject) => {
      exec("df -h --output=used,avail,pcent / | tail -1", (err, stdout) => {
        if (err) return reject(err);
        const [used, avail, percent] = stdout.trim().split(/\s+/);
        resolve({ used, available: avail, usagePercent: percent });
      });
    });

    // Database connection
    const dbStatus =
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

    res.json({
      success: true,
      server: {
        uptime: os.uptime() + " seconds",
        cpuLoad: {
          "1min": cpuLoad[0].toFixed(2),
          "5min": cpuLoad[1].toFixed(2),
          "15min": cpuLoad[2].toFixed(2),
        },
        memoryUsage,
        diskUsage,
      },
      database: {
        status: dbStatus,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching system health",
      error: error.message,
    });
  }
};

// GET: /api/users/:id
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "userdetails",
          localField: "_id",
          foreignField: "userId",
          as: "details",
        },
      },
      { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: "$_id",
          userProfileImage: "$details.profileImage",
          status: { $literal: "Active" },
          age: "$details.age",
          email: "$email",
          mobileNumber: "$mobileNumber",
          location: "$details.location",
          educationJob: "$details.educationJob",
          joined: "$createdAt",
        },
      },
    ]);

    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: user[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

exports.getUserList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;

    // Count total users
    const totalUsers = await User.countDocuments();

    const users = await User.aggregate([
      { $sort: { createdAt: -1 } }, // newest first
      { $skip: skip },
      { $limit: limit },

      // Join UserDetail
      {
        $lookup: {
          from: "userdetails",
          localField: "_id",
          foreignField: "userId",
          as: "details",
        },
      },
      { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },

      // Join UserBlock
      {
        $lookup: {
          from: "userblocks",
          localField: "_id",
          foreignField: "userId",
          as: "blockInfo",
        },
      },
      { $unwind: { path: "$blockInfo", preserveNullAndEmptyArrays: true } },

      // Join UserVerification
      {
        $lookup: {
          from: "userverifications",
          localField: "_id",
          foreignField: "userId",
          as: "verifyInfo",
        },
      },
      { $unwind: { path: "$verifyInfo", preserveNullAndEmptyArrays: true } },

      // Final projection
      {
        $project: {
          id: "$_id",
          name: "$details.name",
          age: "$details.age",
          location: "$details.location",
          status: {
            $cond: [
              { $eq: ["$blockInfo.status", "blocked"] },
              "Blocked",
              "Active",
            ],
          },
          isVerified: { $ifNull: ["$verifyInfo.isVerified", false] },
          joined: "$createdAt",
        },
      },
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user list",
      error: error.message,
    });
  }
};

// GET: /api/admin/filters?type=caste
exports.getFilters = async (req, res) => {
  try {
    const { type } = req.query; // e.g. "caste"

    let query = {};
    if (type) query.type = type; // filter by type if passed

    // Fetch filters
    const filters = await FilterMaster.find(query).sort({ name: 1 }).lean();

    // Record filter usage (increment count in FilterMaster)
    if (type) {
      await FilterMaster.updateMany(
        { type },
        { $inc: { usageCount: 1 } } // increase usageCount field
      );
    }

    res.json({
      success: true,
      filters,
      count: filters.length,
      message: "Filters fetched and usage recorded",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching filters",
      error: error.message,
    });
  }
};
