const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createAdmin = async (req, res) => {
  try {
    const { name, mobileNumber, email, password } = req.body;

    const existing = await Admin.findOne({
      $or: [{ email }, { mobileNumber }],
    });
    if (existing) return res.status(400).json({ msg: "Already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      mobileNumber,
      email,
      password: hashedPassword,
    });

    await admin.save();
    res.json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// exports.loginAdmin = async (req, res) => {
//   try {
//     const { identifier, password } = req.body;

//     const user = await Admin.findOne({
//       $or: [{ email: identifier }, { mobileNumber: identifier }],
//     });

//     if (!user) return res.status(400).json({ msg: "Admin not found" });

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
  res.json({ message: "Logged out (token removed on client)" });
};
