// controllers/favoriteController.js
const Favorite = require("../models/Favorite");
const UserDetail = require("../models/UserDetail");

// Add favorite (user favorites another user)
exports.addFavorite = async (req, res) => {
  try {
    const { userId } = req.params; // user being favorited
    const favoritedBy = req.user.id; // current logged-in user

    if (favoritedBy === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot favorite yourself",
        data: [],
        error: "Invalid Operation",
      });
    }

    const existing = await Favorite.findOne({
      favoritedBy,
      favoritedUser: userId,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already favorited this user",
        data: [],
        error: "Duplicate Entry",
      });
    }

    const newFav = await Favorite.create({
      favoritedBy,
      favoritedUser: userId,
    });

    res.json({
      success: true,
      message: "User added to favorites",
      data: [newFav],
      error: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: err.message,
    });
  }
};

// Remove favorite
exports.removeFavorite = async (req, res) => {
  try {
    const { userId } = req.params; // user being unfavorited
    const favoritedBy = req.user.id;

    const deleted = await Favorite.findOneAndDelete({
      favoritedBy,
      favoritedUser: userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
        data: [],
        error: "Not Found",
      });
    }

    res.json({
      success: true,
      message: "Favorite removed",
      data: [deleted],
      error: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: err.message,
    });
  }
};

// Get all favorites received by a user
exports.getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.find({ favoritedUser: userId }).populate(
      "favoritedBy",
      "name email"
    ); // show who favorited

    res.json({
      success: true,
      message: "Favorites fetched successfully",
      data: favorites,
      error: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: err.message,
    });
  }
};
