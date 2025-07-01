const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const validatePassword = require("../utils/validatePassword");

exports.register = async (req, res) => {
  try {
    const {
      mobileNumber,
      profileCreatingFor,
      gender,
      name,
      dob,
      maritalStatus,
      emailId,
      password,
    } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ emailId }, { mobileNumber }],
    });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "Email or Mobile Number already registered." });

    // Validate password strength
    // if (!validatePassword(password)) {
    //   return res.status(400).json({
    //     msg: "Password must contain uppercase, lowercase, number, symbol, and be 8+ characters long.",
    //   });
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      mobileNumber,
      profileCreatingFor,
      gender,
      name,
      dob,
      maritalStatus,
      emailId,
      password: hashedPassword,
    });

    await user.save();
    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Check user by email or mobile number
    const user = await User.findOne({
      $or: [{ emailId: identifier }, { mobileNumber: identifier }],
    });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Simplified response
    res.status(200).json({
      msg: "Login successful",
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};
