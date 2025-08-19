const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/userController");
const auth = require("./../middlewares/auth");

// Public Routes
router.post("/register", userController.register);
router.post("/verifyOtp", userController.verifyOtp);
router.post("/setPassword", userController.setPassword);
router.post("/login", userController.login);
router.get("/getUserProfileList", auth, userController.getUserProfileList);
// ✅ if you have login logic

// Protected Routes
// router.get(
//   "/profile",
//   passport.authenticate("jwt", { session: false }),
//   userController.getProfile // ✅ Returns req.user from JWT
// );

module.exports = router;
