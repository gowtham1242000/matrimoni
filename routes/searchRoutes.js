const express = require("express");
const router = express.Router();
const {
  searchProfiles,
  searchByIdOrName,
  searchByName,
} = require("../controllers/searchController");

// 1) Search with filters
router.get("/", searchProfiles);

// 2) Search by ID or Name
router.get("/keyword", searchByIdOrName);

// 3) Search by Name only
router.get("/name", searchByName);

module.exports = router;
