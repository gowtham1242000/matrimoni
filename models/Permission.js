const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "VIEW_USERS"
  description: { type: String }, // optional, e.g. "Can see the list of users"
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Permission", permissionSchema);
