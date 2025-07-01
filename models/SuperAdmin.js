const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema({
  name: String,
  mobileNumber: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "SuperAdmin" },
});

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
