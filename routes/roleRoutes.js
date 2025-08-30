const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

// Role APIs
router.post("/create", roleController.createRole);
router.get("/list", roleController.getAllRoles);
router.get("/get/:id", roleController.getRoleById);
router.put("/update/:id", roleController.updateRoleById);
router.delete("/delete/:id", roleController.deleteroleById);

module.exports = router;
