const mongoose = require("mongoose");

const roleUserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Full Name
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // store hashed password
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" }, // e.g. Admin / Support
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }], // assign permissions here
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "RoleUser" }, // SuperAdmin who created
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RoleUser", roleUserSchema);
