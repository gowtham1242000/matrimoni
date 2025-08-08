const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to req object
    req.user = decoded; // decoded should contain { id: userId }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
