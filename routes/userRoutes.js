const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/userController");

// Public Routes
router.post("/register", userController.register);
router.post("/verifyOtp", userController.verifyOtp);
router.post("/setPassword", userController.setPassword);
router.post("/login", userController.login); // ✅ if you have login logic

// Protected Routes
// router.get(
//   "/profile",
//   passport.authenticate("jwt", { session: false }),
//   userController.getProfile // ✅ Returns req.user from JWT
// );

module.exports = router;
