const Permission = require("../models/Permission");

exports.createPermission = async (req, res) => {
  try {
    const permission = new Permission(req.body);
    await permission.save();
    res.json({ success: true, data: permission });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getAllPermission = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.json({ success: true, data: permissions });
  } catch (error) {
    res.status(400).json({ sucess: false, error: err.message });
  }
};

exports.getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res
        .status(404)
        .json({ success: false, error: "Permission not found" });
    }
    res.json({ success: true, data: permission });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updatePermissionById = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!permission) {
      return res
        .status(404)
        .json({ success: false, error: "Permission not found" });
    }
    res.json({ success: true, data: permission });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deletepermissionById = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    if (!permission) {
      return res
        .status(404)
        .json({ success: false, error: "Permission not found" });
    }
    res.json({ success: true, message: "Permission deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
