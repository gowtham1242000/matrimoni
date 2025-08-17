// controllers/likeController.js
const Like = require("../models/Like");

// Add like (user liking another user)
exports.addLike = async (req, res) => {
  try {
    const { userId } = req.params; // user being liked
    const likedBy = req.user.id; // current logged-in user

    if (likedBy === userId) {
      return res.status(400).json({ msg: "You cannot like yourself" });
    }

    const existing = await Like.findOne({ likedBy, likedUser: userId });
    if (existing)
      return res.status(400).json({ msg: "Already liked this user" });

    const newLike = await Like.create({ likedBy, likedUser: userId });
    res.json({ msg: "User liked", like: newLike });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Remove like
exports.removeLike = async (req, res) => {
  try {
    const { userId } = req.params; // user being unliked
    const likedBy = req.user.id;

    const deleted = await Like.findOneAndDelete({ likedBy, likedUser: userId });
    if (!deleted) return res.status(404).json({ msg: "Like not found" });

    res.json({ msg: "Like removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get likes of a user (who liked this user)
exports.getLikes = async (req, res) => {
  try {
    const { userId } = req.params;
    const likes = await Like.find({ likedUser: userId }).populate(
      "likedBy",
      "name email"
    ); // show liker details

    res.json({ count: likes.length, likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
