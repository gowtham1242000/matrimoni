const bcrypt = require("bcryptjs");
const NewAdmin = require("../models/newAdmin");
const Role = require("./../models/Role");
const Permission = require("./../models/Permission");

// CREATE ADMIN
exports.createAdmin = async (req, res) => {
  try {
    const { fullName, email, role, password, permissions } = req.body;

    // check if admin already exists
    const existingAdmin = await NewAdmin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    // fetch role by ID
    const roleDoc = await Role.findById(role);
    if (!roleDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    // fetch permissions by IDs
    let permissionDocs = [];
    if (permissions && permissions.length > 0) {
      permissionDocs = await Permission.find({ _id: { $in: permissions } });
      if (permissionDocs.length !== permissions.length) {
        return res
          .status(404)
          .json({ success: false, message: "Some permissions not found" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new NewAdmin({
      fullName,
      email,
      role: roleDoc.name,
      password: hashedPassword,
      permissions: permissionDocs.map((p) => p.name),
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating admin",
      error: error.message,
    });
  }
};

// GET ALL ADMINS
exports.getAdmins = async (req, res) => {
  try {
    const admins = await NewAdmin.find().select("-password");
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching admins",
      error: error.message,
    });
  }
};

// GET ADMIN BY ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await NewAdmin.findById(req.params.id).select("-password");
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching admin",
      error: error.message,
    });
  }
};

// UPDATE ADMIN
exports.updateAdmin = async (req, res) => {
  try {
    const { fullName, email, role, password, permissions } = req.body;

    const admin = await NewAdmin.findById(req.params.id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    // fetch role by ID (if passed)
    if (role) {
      const roleDoc = await Role.findById(role);
      if (!roleDoc) {
        return res
          .status(404)
          .json({ success: false, message: "Role not found" });
      }
      admin.role = roleDoc.name;
    }

    // fetch permissions by IDs (if passed)
    if (permissions && permissions.length > 0) {
      const permissionDocs = await Permission.find({
        _id: { $in: permissions },
      });
      if (permissionDocs.length !== permissions.length) {
        return res
          .status(404)
          .json({ success: false, message: "Some permissions not found" });
      }
      admin.permissions = permissionDocs.map((p) => p.name);
    }

    if (fullName) admin.fullName = fullName;
    if (email) admin.email = email;
    if (password) admin.password = await bcrypt.hash(password, 10);

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating admin",
      error: error.message,
    });
  }
};

// DELETE ADMIN
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await NewAdmin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error deleting admin",
      error: error.message,
    });
  }
};

exports.updateAdminStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // validate status
    if (!["active", "deactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: active, deactive",
      });
    }

    // update status
    const admin = await NewAdmin.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Admin status updated to ${status}`,
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating admin status",
      error: error.message,
    });
  }
};
