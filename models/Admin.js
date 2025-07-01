const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  mobileNumber: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "Admin" },
});

module.exports = mongoose.model("Admin", adminSchema);
