// controllers/likeController.js
const Like = require("../models/Like");

// Add like (user liking another user)
// Add Like
exports.addLike = async (req, res) => {
  try {
    const { userId } = req.params; // user being liked
    const likedBy = req.user.id; // current logged-in user

    if (likedBy === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot like yourself",
        data: [],
        error: "Invalid Operation",
      });
    }

    const existing = await Like.findOne({ likedBy, likedUser: userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already liked this user",
        data: [],
        error: "Duplicate Entry",
      });
    }

    const newLike = await Like.create({ likedBy, likedUser: userId });

    res.json({
      success: true,
      message: "User liked",
      data: [newLike],
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

// Remove Like
exports.removeLike = async (req, res) => {
  try {
    const { userId } = req.params; // user being unliked
    const likedBy = req.user.id;

    const deleted = await Like.findOneAndDelete({ likedBy, likedUser: userId });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
        data: [],
        error: "Not Found",
      });
    }

    res.json({
      success: true,
      message: "Like removed",
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

// Get Likes of a User
exports.getLikes = async (req, res) => {
  try {
    const { userId } = req.params;
    const likes = await Like.find({ likedUser: userId }).populate(
      "likedBy",
      "name email"
    ); // show liker details

    res.json({
      success: true,
      message: "Likes fetched successfully",
      data: likes,
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
