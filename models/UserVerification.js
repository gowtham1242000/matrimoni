const mongoose = require("mongoose");

const UserVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserVerification", UserVerificationSchema);
