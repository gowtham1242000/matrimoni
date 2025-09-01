// ================== ROLE APIS ==================
const Role = require("../models/Role"); // adjust path as per your structure

// Create Role
exports.createRole = async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.json({ success: true, data: role });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get All Roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json({ success: true, data: roles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, error: "Role not found" });
    }
    res.json({ success: true, data: role });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update Role by ID
exports.updateRoleById = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("permissions");

    if (!role) {
      return res.status(404).json({ success: false, error: "Role not found" });
    }
    res.json({ success: true, data: role });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete Role by ID
exports.deleteroleById = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, error: "Role not found" });
    }
    res.json({ success: true, message: "Role deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
