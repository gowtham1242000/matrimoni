const express = require("express");
const router = express.Router();
const userBlockController = require("../controllers/userBlockController");

router.put("/:id", userBlockController.blockUser);

module.exports = router;
