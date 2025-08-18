// controllers/searchController.js
const UserDetail = require("../models/UserDetail");
const Favorite = require("../models/Favorite");

// 1️⃣ Search by Filters
exports.searchProfiles = async (req, res) => {
  try {
    const {
      minAge,
      maxAge,
      minHeight,
      maxHeight,
      religion,
      caste,
      maritalStatus,
      motherTongue,
    } = req.query;

    let filter = {};

    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = parseInt(minAge);
      if (maxAge) filter.age.$lte = parseInt(maxAge);
    }

    if (minHeight || maxHeight) {
      filter.height = {};
      if (minHeight) filter.height.$gte = minHeight;
      if (maxHeight) filter.height.$lte = maxHeight;
    }

    if (religion) filter.religion = religion;
    if (caste) filter.caste = caste;
    if (maritalStatus) filter.maritalStatus = maritalStatus;
    if (motherTongue) filter.motherTongue = motherTongue;

    const profiles = await UserDetail.find(filter).select(
      "name gender age height religion caste maritalStatus motherTongue city state photos"
    );

    return res.json({
      success: true,
      message: "Profiles fetched successfully",
      data: profiles,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: err.message,
    });
  }
};

// 2️⃣ Search by ID or Name
exports.searchByIdOrName = async (req, res) => {
  try {
    const { keyword } = req.query; // Can be ID or Name

    let profiles = [];

    // If keyword looks like an ObjectId → search by _id
    if (/^[0-9a-fA-F]{24}$/.test(keyword)) {
      profiles = await UserDetail.find({ _id: keyword }).select(
        "name gender age height"
      );
    }

    // Otherwise search by name
    if (profiles.length === 0) {
      profiles = await UserDetail.find({
        name: { $regex: keyword, $options: "i" },
      }).select("name gender age height");
    }

    return res.json({
      success: true,
      message: "Profiles fetched successfully",
      data: profiles,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: err.message,
    });
  }
};

// 3️⃣ Search by Name only (restricted to Favorites)
exports.searchByName = async (req, res) => {
  try {
    const { name } = req.query;
    const userId = req.user.id; // From auth middleware

    // 1. Get all favorites of the logged-in user
    const favorites = await Favorite.find({ userId }).select("favoriteUserId");

    const favoriteIds = favorites.map((fav) => fav.favoriteUserId);

    // 2. Search only in favorite users by name
    const profiles = await UserDetail.find({
      _id: { $in: favoriteIds },
      name: { $regex: name, $options: "i" },
    }).select("name gender age height");

    return res.json({
      success: true,
      message: "Profiles fetched successfully",
      data: profiles,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: err.message,
    });
  }
};
