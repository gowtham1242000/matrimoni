const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminController");
const adminController = require("../controllers/adminDashboard");

router.post("/create", controller.createAdmin);
//router.post("/login", controller.loginAdmin);
router.get("/logout", controller.logout);
router.get("/overview", adminController.getDashboardOverView);
router.get("/getSystemHealth", adminController.getSystemHealth);

module.exports = router;
