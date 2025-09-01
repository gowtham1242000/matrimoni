const mongoose = require("mongoose");

const newAdminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String, // store role name directly
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    permissions: [
      {
        type: String, // store permission names directly
      },
    ],
    status: { type: String, enum: ["active", "deactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("newAdmin", newAdminSchema);
