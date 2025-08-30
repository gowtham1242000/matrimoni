const mongoose = require("mongoose");

const UserBlockSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    blockedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserBlock", UserBlockSchema);
