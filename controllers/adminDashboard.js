const User = require("../models/User");
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
