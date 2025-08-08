const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validatePassword = require("../utils/validatePassword");

// Helper to generate OTP (4-digit for example)
const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

/**
 * 1️⃣ Register - OTP First
 */
exports.register = async (req, res) => {
  try {
    const { mobileNumber, emailId } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ emailId }, { mobileNumber }],
    });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "Email or Mobile Number already registered." });

    // Set default OTP
    const otp = "1234"; // Fixed OTP
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Save user without password
    const user = new User({
      mobileNumber,
      otp,
      otpExpiry,
      isOtpVerified: false,
    });

    await user.save();

    // Log OTP (since we're not sending SMS here)
    console.log(`✅ OTP for ${mobileNumber || emailId} is: ${otp}`);

    res
      .status(200)
      .json({ msg: "OTP sent successfully. Please verify to set password." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

/**
 * 2️⃣ Verify OTP
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    const user = await User.findOne({
      $or: [{ emailId: identifier }, { mobileNumber: identifier }],
    });

    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.isOtpVerified)
      return res.status(400).json({ msg: "OTP already verified" });

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isOtpVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();
    res
      .status(200)
      .json({ msg: "OTP verified. You can now set your password." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

/**
 * 3️⃣ Set Password (after OTP verification)
 */
exports.setPassword = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ emailId: identifier }, { mobileNumber: identifier }],
    });

    if (!user) return res.status(400).json({ msg: "User not found" });
    if (!user.isOtpVerified)
      return res.status(400).json({ msg: "OTP not verified yet" });

    // Validate password
    if (!validatePassword(password)) {
      return res.status(400).json({
        msg: "Password must contain uppercase, lowercase, number, symbol, and be 8+ characters long.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    res
      .status(200)
      .json({ msg: "Password set successfully. You can now login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

/**
 * 4️⃣ Login
 */
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ emailId: identifier }, { mobileNumber: identifier }],
    });

    if (!user) return res.status(400).json({ msg: "User not found" });
    if (!user.isOtpVerified)
      return res.status(400).json({ msg: "Please verify OTP first" });
    if (!user.password)
      return res.status(400).json({ msg: "Please set your password first" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ msg: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};
