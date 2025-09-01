const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NewAdmin = require("../models/newAdmin");

exports.commonLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await NewAdmin.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Invalid password" });
    }

    // role & permissions from DB
    const role = user.role; // already stored as role name
    const permissions = user.permissions || [];

    // generate JWT token
    const token = jwt.sign(
      { id: user._id, role, permissions },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      msg: `Login successful as ${role}`,
      role,
      permissions,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
