const express = require("express");
const router = express.Router();
const controller = require("../controllers/commonLoginController");

router.post("/login", controller.commonLogin);

module.exports = router;
