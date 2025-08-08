const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const auth = require("./../middlewares/auth");
const userDetailController = require("../controllers/userDetailController");

// route to create user detail with dummy image handling
router.post("/basic", auth, userDetailController.createOrUpdateBasic);
router.post("/details", auth, userDetailController.basicDetails);
router.post("/location", auth, userDetailController.locationDetails);
router.post("/physical", auth, userDetailController.physicalDetails);
router.post("/education-job", auth, userDetailController.educationJob);
router.post("/family", auth, userDetailController.familyDetails);
router.post(
  "/photos",
  auth,
  upload.array("photos", 4),
  userDetailController.uploadPhotos
);
router.post("/about", auth, userDetailController.aboutYourself);
router.get("/", auth, userDetailController.getProfile);
router.get(
  "/getCompletionPercentage",
  auth,
  userDetailController.getCompletionPercentage
);

module.exports = router;
