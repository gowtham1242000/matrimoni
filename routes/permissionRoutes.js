const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionsController");

// Permission APIs
router.post("/create", permissionController.createPermission);
router.get("/list", permissionController.getAllPermission);
router.get("/get/:id", permissionController.getPermissionById);
router.put("/update/:id", permissionController.updatePermissionById);
router.delete("/delete/:id", permissionController.deletepermissionById);

module.exports = router;
