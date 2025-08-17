// routes/favoriteRoutes.js
const express = require("express");
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites,
} = require("../controllers/favoriteController");
const auth = require("./../middlewares/auth");

// Favorite a user
router.post("/:userId", auth, addFavorite);

// Unfavorite a user
router.delete("/:userId", auth, removeFavorite);

// Get all favorites received by a user
router.get("/:userId", getFavorites);

module.exports = router;
