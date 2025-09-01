const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Admin", "Support"
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "RoleUser" }, // SuperAdmin ID
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Role", roleSchema);
