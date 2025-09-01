const express = require("express");
const router = express.Router();
const adminController = require("./../controllers/newAdminController");

router.post("/", adminController.createAdmin); // create
router.get("/", adminController.getAdmins); // list
router.get("/:id", adminController.getAdminById); // get by id
router.put("/:id", adminController.updateAdmin); // update
router.delete("/:id", adminController.deleteAdmin); // delete
router.put("/statusUpdate/:id", adminController.updateAdminStatus);
module.exports = router;
