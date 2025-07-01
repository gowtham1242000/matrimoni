const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true, unique: true },
  profileCreatingFor: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  maritalStatus: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["User"], default: "User" },
});

module.exports = mongoose.model("User", userSchema);
