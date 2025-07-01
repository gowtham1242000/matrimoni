const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const userDetailController = require("../controllers/userDetailController");

// route to create user detail with dummy image handling
router.post(
  "/create",
  // upload.single("photo"),
  userDetailController.createUserDetail
);

router.get("/getByUserId/:userId", userDetailController.getUserDetailByUserId);

module.exports = router;
