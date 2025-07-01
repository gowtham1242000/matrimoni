const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminController");

router.post("/create", controller.createAdmin);
//router.post("/login", controller.loginAdmin);
router.get("/logout", controller.logout);

module.exports = router;
