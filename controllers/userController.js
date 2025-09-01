const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validatePassword = require("../utils/validatePassword");
const UserDetail = require("../models/UserDetail");

// Helper to generate OTP
const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

// Helper: Standard API Response
const sendResponse = (
  res,
  success,
  message,
  data = [],
  error = null,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    error,
  });
};

// 1️⃣ Register
exports.register = async (req, res) => {
  try {
    const { mobileNumber, emailId } = req.body;

    if (!mobileNumber) {
      return sendResponse(
        res,
        false,
        "Mobile number is required",
        [],
        "Validation Error",
        400
      );
    }

    const normalizedMobile = mobileNumber
      .trim()
      .replace(/^0/, "+91")
      .replace(/^91/, "+91");

    const query = { mobileNumber: normalizedMobile };

    if (emailId && emailId.trim() !== "") {
      query.$or = [
        { emailId: emailId.trim() },
        { mobileNumber: normalizedMobile },
      ];
    }

    const existingUser = await User.findOne(query);
    if (existingUser) {
      return sendResponse(
        res,
        false,
        existingUser.mobileNumber === normalizedMobile
          ? "Mobile number already registered"
          : "Email already registered",
        [],
        null,
        400
      );
    }

    const otp = "1234"; // Replace with generateOtp() in production
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const user = new User({
      mobileNumber: normalizedMobile,
      emailId: emailId ? emailId.trim() : undefined,
      otp,
      otpExpiry,
      isOtpVerified: false,
    });

    await user.save();

    console.log(`✅ OTP for ${normalizedMobile} is: ${otp}`);

    return sendResponse(res, true, "OTP sent successfully");
  } catch (err) {
    console.error(err);
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// 2️⃣ Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    const user = await User.findOne({
      $or: [{ emailId: identifier }, { mobileNumber: identifier }],
    });

    if (!user) return sendResponse(res, false, "User not found", [], null, 400);
    if (user.isOtpVerified)
      return sendResponse(res, false, "OTP already verified", [], null, 400);

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return sendResponse(res, false, "Invalid or expired OTP", [], null, 400);
    }

    user.isOtpVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();
    return sendResponse(
      res,
      true,
      "OTP verified. You can now set your password."
    );
  } catch (err) {
    console.error(err);
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// 3️⃣ Set Password
exports.setPassword = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ emailId: identifier }, { mobileNumber: identifier }],
    });

    if (!user) return sendResponse(res, false, "User not found", [], null, 400);
    if (!user.isOtpVerified)
      return sendResponse(res, false, "OTP not verified yet", [], null, 400);

    if (!validatePassword(password)) {
      return sendResponse(
        res,
        false,
        "Password must contain uppercase, lowercase, number, symbol, and be 8+ characters long.",
        [],
        null,
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    return sendResponse(
      res,
      true,
      "Password set successfully. You can now login."
    );
  } catch (err) {
    console.error(err);
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// 4️⃣ Login
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ emailId: identifier }, { mobileNumber: identifier }],
    });

    if (!user) return sendResponse(res, false, "User not found", [], null, 400);
    if (!user.isOtpVerified)
      return sendResponse(res, false, "Please verify OTP first", [], null, 400);
    if (!user.password)
      return sendResponse(
        res,
        false,
        "Please set your password first",
        [],
        null,
        400
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return sendResponse(res, false, "Invalid credentials", [], null, 400);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return sendResponse(res, true, "Login successful", { token });
  } catch (err) {
    console.error(err);
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// -------------------- USER PROFILE LIST --------------------
exports.getUserProfileList = async (req, res) => {
  try {
    // Get pagination params (default page=1, limit=5)
    let { page = 1, limit = 5 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // Skip my profile (auth user)
    const query = { userId: { $ne: req.user.id } };

    // Get total count
    const totalUsers = await UserDetail.countDocuments(query);

    // Get paginated users
    const users = await UserDetail.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v -updatedAt") // exclude unwanted fields if needed
      .lean();

    res.json({
      success: true,
      message: "User profiles fetched",
      data: users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

// ================== FORGOT PASSWORD FLOW ==================

// 1️⃣ Forgot Password (send OTP)
exports.forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;

    const user = await User.findOne({
      $or: [{ emailId: identifier }, { mobileNumber: identifier }],
    });

    if (!user) {
      return sendResponse(res, false, "User not found", [], null, 400);
    }

    // Set default OTP for now (in real use generateOtp())
    const otp = "4321";
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.isOtpVerified = false; // reset verification for reset flow

    await user.save();

    console.log(`📩 Forgot Password OTP for ${identifier}: ${otp}`);

    return sendResponse(res, true, "OTP sent for password reset");
  } catch (err) {
    console.error(err);
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// 2️⃣ Verify Forgot Password OTP
exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    const user = await User.findOne({
      $or: [{ emailId: identifier }, { mobileNumber: identifier }],
    });

    if (!user) return sendResponse(res, false, "User not found", [], null, 400);

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return sendResponse(res, false, "Invalid or expired OTP", [], null, 400);
    }

    user.isOtpVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Issue a temporary token for password reset
    const resetToken = jwt.sign(
      { id: user._id, purpose: "resetPassword" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return sendResponse(
      res,
      true,
      "OTP verified. You can reset password now.",
      {
        resetToken,
      }
    );
  } catch (err) {
    console.error(err);
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// 3️⃣ Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, password } = req.body;

    if (!resetToken)
      return sendResponse(res, false, "Reset token is required", [], null, 400);

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return sendResponse(
        res,
        false,
        "Invalid or expired reset token",
        [],
        err.message,
        400
      );
    }

    const user = await User.findById(decoded.id);
    if (!user) return sendResponse(res, false, "User not found", [], null, 400);

    if (!validatePassword(password)) {
      return sendResponse(
        res,
        false,
        "Password must contain uppercase, lowercase, number, symbol, and be 8+ characters long.",
        [],
        null,
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return sendResponse(
      res,
      true,
      "Password reset successfully. Please login."
    );
  } catch (err) {
    console.error(err);
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};
