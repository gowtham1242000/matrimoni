// routes/likeRoutes.js
const express = require("express");
const router = express.Router();
const {
  addLike,
  removeLike,
  getLikes,
} = require("../controllers/likeController");
const auth = require("./../middlewares/auth");

// Like a user
router.post("/:userId", auth, addLike);

// Unlike a user
router.delete("/:userId", auth, removeLike);

// Get all likes received by a user
router.get("/:userId", getLikes);

module.exports = router;
