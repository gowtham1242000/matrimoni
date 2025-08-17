// controllers/favoriteController.js
const Favorite = require("../models/Favorite");

// Add favorite (user favorites another user)
exports.addFavorite = async (req, res) => {
  try {
    const { userId } = req.params; // user being favorited
    const favoritedBy = req.user.id; // current logged-in user

    if (favoritedBy === userId) {
      return res.status(400).json({ msg: "You cannot favorite yourself" });
    }

    const existing = await Favorite.findOne({
      favoritedBy,
      favoritedUser: userId,
    });
    if (existing)
      return res.status(400).json({ msg: "Already favorited this user" });

    const newFav = await Favorite.create({
      favoritedBy,
      favoritedUser: userId,
    });
    res.json({ msg: "User added to favorites", favorite: newFav });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
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
    if (!deleted) return res.status(404).json({ msg: "Favorite not found" });

    res.json({ msg: "Favorite removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
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

    res.json({ count: favorites.length, favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
