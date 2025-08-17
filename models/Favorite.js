// models/Favorite.js
const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema(
  {
    favoritedBy: {
      // who marked favorite
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    favoritedUser: {
      // the user being marked as favorite
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent same user favoriting the same person multiple times
FavoriteSchema.index({ favoritedBy: 1, favoritedUser: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);
