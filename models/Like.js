// models/Like.js
const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    likedBy: {
      // who liked
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likedUser: {
      // the user being liked
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent same user liking the same person multiple times
LikeSchema.index({ likedBy: 1, likedUser: 1 }, { unique: true });

module.exports = mongoose.model("Like", LikeSchema);
