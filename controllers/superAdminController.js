const SuperAdmin = require("../models/SuperAdmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createSuperAdmin = async (req, res) => {
  try {
    const { name, mobileNumber, email, password } = req.body;

    const existing = await SuperAdmin.findOne({
      $or: [{ email }, { mobileNumber }],
    });
    if (existing) return res.status(400).json({ msg: "Already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = new SuperAdmin({
      name,
      mobileNumber,
      email,
      password: hashedPassword,
    });

    await superAdmin.save();
    res.json({ msg: "SuperAdmin created successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// exports.loginSuperAdmin = async (req, res) => {
//   try {
//     const { identifier, password } = req.body;

//     const user = await SuperAdmin.findOne({
//       $or: [{ email: identifier }, { mobileNumber: identifier }],
//     });

//     if (!user) return res.status(400).json({ msg: "SuperAdmin not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     res.json({ msg: "Login successful", token });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };

exports.logout = (req, res) => {
  res.json({ msg: "Logged out (token removed on client)" });
};
