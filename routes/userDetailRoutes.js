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
router.post("/interset", auth, userDetailController.addInterestData);
router.get("/", auth, userDetailController.getProfile);
router.get(
  "/getCompletionPercentage",
  auth,
  userDetailController.getCompletionPercentage
);

// -------------------- BASIC --------------------
router.put("/basic", auth, userDetailController.updateBasic);
router.get("/basic", auth, userDetailController.getBasic);

// -------------------- DETAILS --------------------
router.put("/details", auth, userDetailController.updateDetails);
router.get("/details", auth, userDetailController.getDetails);

// -------------------- LOCATION --------------------
router.put("/location", auth, userDetailController.updateLocation);
router.get("/location", auth, userDetailController.getLocation);

// -------------------- PHYSICAL --------------------
router.put("/physical", auth, userDetailController.updatePhysical);
router.get("/physical", auth, userDetailController.getPhysical);

// -------------------- EDUCATION-JOB --------------------
router.put("/education-job", auth, userDetailController.updateEducationJob);
router.get("/education-job", auth, userDetailController.getEducationJob);

// -------------------- FAMILY --------------------
router.put("/family", auth, userDetailController.updateFamily);
router.get("/family", auth, userDetailController.getFamily);

// -------------------- PHOTOS --------------------
router.put(
  "/photos",
  auth,
  upload.array("photos", 4),
  userDetailController.updatePhotos
);
router.get("/photos", auth, userDetailController.getPhotos);

// -------------------- ABOUT --------------------
router.put("/about", auth, userDetailController.updateAbout);
router.get("/about", auth, userDetailController.getAbout);

// -------------------- INTEREST --------------------
router.put("/interest", auth, userDetailController.updateInterest);
router.get("/interest", auth, userDetailController.getInterest);

// -------------------- FULL PROFILE --------------------
router.get("/", auth, userDetailController.getProfile);

// -------------------- COMPLETION PERCENTAGE --------------------
router.get(
  "/getCompletionPercentage",
  auth,
  userDetailController.getCompletionPercentage
);

module.exports = router;
