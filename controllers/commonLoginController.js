const Admin = require("../models/Admin");
const SuperAdmin = require("../models/SuperAdmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.commonLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    let user = await Admin.findOne({
      $or: [{ email: identifier }, { mobileNumber: identifier }],
    });
    let role = "Admin";

    if (!user) {
      user = await SuperAdmin.findOne({
        $or: [{ email: identifier }, { mobileNumber: identifier }],
      });
      role = "SuperAdmin";
    }

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      msg: `Login successful as ${role}`,
      role,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
