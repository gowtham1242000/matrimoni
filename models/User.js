const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    mobileNumber: { type: String, required: false, sparse: true },
    emailId: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // This makes MongoDB allow multiple nulls
    },

    // OTP fields
    otp: { type: String }, // store OTP (hashed if you want more security)
    otpExpiry: { type: Date }, // OTP expiry time
    isOtpVerified: { type: Boolean, default: false }, // OTP verification status

    // Password field (optional until OTP verified)
    password: { type: String },

    role: { type: String, enum: ["User"], default: "User" },
  },
  { timestamps: true }
);

// Pre-save hook to enforce password setting only after OTP verification
userSchema.pre("save", function (next) {
  if (!this.isOtpVerified && this.password) {
    return next(new Error("Cannot set password before OTP verification."));
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
