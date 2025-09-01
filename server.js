const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const app = express();

require("./config/db"); // DB connection
require("./config/passport"); // Passport config

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
//app.use("/api/admin", require("./routes/adminRoutes"));
//app.use("/api/superadmin", require("./routes/superAdminRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/user-detail", require("./routes/userDetailRoutes"));
app.use("/api/superadmin", require("./routes/superAdminRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/common", require("./routes/commonLoginRoute"));
app.use("/api/like", require("./routes/likeRoutes"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/verify", require("./routes/userVerificationRoutes"));
app.use("/api/block", require("./routes/userBlockRoutes"));
app.use("/api/role", require("./routes/roleRoutes"));
app.use("/api/permission", require("./routes/permissionRoutes"));
app.use("/api/newAdmin", require("./routes/newAdminRoutes"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
