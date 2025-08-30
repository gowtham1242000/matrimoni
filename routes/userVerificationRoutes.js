const express = require("express");
const router = express.Router();
const verificationController = require("../controllers/userVerificationController");

router.put("/:id", verificationController.verifyProfile);

module.exports = router;
