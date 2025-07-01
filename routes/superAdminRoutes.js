const express = require("express");
const router = express.Router();
const controller = require("../controllers/superAdminController");

router.post("/create", controller.createSuperAdmin);
//router.post("/login", controller.loginSuperAdmin);
router.get("/logout", controller.logout);

module.exports = router;
