const UserDetail = require("../models/UserDetail");
const calculateProfileCompletion = require("./../utils/profileCompletion");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const BASE_DIR = "/etc/ec/userphoto"; // storage root
const BASE_URL = "http://165.22.222.251:80"; // change to your IP/domain
// Helper: Standard API Response
const sendResponse = (
  res,
  success,
  message,
  data = [],
  error = null,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    error,
  });
};

exports.createOrUpdateBasic = async (req, res) => {
  try {
    const { profileCreatingFor, name, gender, dob } = req.body;

    let dobDate = null;
    if (dob) {
      // expecting format "DD-MM-YYYY"
      const [day, month, year] = dob.split("-");
      dobDate = new Date(`${year}-${month}-${day}`);
    }

    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { profileCreatingFor, name, gender, dob: dobDate },
      { new: true, upsert: true }
    );

    const completion = calculateProfileCompletion(profile);

    return sendResponse(res, true, "Basic info updated", {
      profile: {
        ...profile._doc,
        dob: profile.dob
          ? profile.dob
              .toISOString()
              .split("T")[0]
              .split("-")
              .reverse()
              .join("-") // "DD-MM-YYYY"
          : null,
      },
      completionPercentage: completion,
    });
  } catch (err) {
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// 2️⃣ Basic Details
exports.basicDetails = async (req, res) => {
  try {
    const { motherTongue, religion, caste } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { motherTongue, religion, caste },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    return sendResponse(res, true, "Details updated", {
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// 3️⃣ Location Details
exports.locationDetails = async (req, res) => {
  try {
    const { address, city, state, district, pincode } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { address, state, district, city, pincode },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    return sendResponse(res, true, "Location updated", {
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// 4️⃣ Physical Details
exports.physicalDetails = async (req, res) => {
  try {
    const { height, weight, bodyType, diet, disability } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { height, weight, bodyType, diet, disability },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    return sendResponse(res, true, "Physical details updated", {
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// 5️⃣ Education & Job
exports.educationJob = async (req, res) => {
  try {
    const { highestEducation, jobTitle, professionType } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { highestEducation, jobTitle, professionType },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    return sendResponse(res, true, "Education & Job details updated", {
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// 6️⃣ Family Details
exports.familyDetails = async (req, res) => {
  try {
    const {
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      siblingsCount,
      familyStatus,
    } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      {
        fatherName,
        fatherOccupation,
        motherName,
        motherOccupation,
        siblingsCount,
        familyStatus,
      },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    return sendResponse(res, true, "Family details updated", {
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// helper: save image
// helper: save image
const saveImage = async (buffer, userId, uniqueName) => {
  const userDir = path.join(BASE_DIR, userId.toString());
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  const filePath = path.join(userDir, uniqueName + ".jpg");

  await sharp(buffer)
    .resize(800, 800, { fit: "inside" })
    .jpeg({ quality: 80 })
    .toFile(filePath);

  // return URL with full path-like structure
  return `${BASE_URL}/etc/ec/userphoto/${userId}/${uniqueName}.jpg`;
};

// 7️⃣ Upload Photos

exports.uploadPhotos = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await UserDetail.findOne({ userId });

    if (profile && profile.photos && profile.photos.length >= 4) {
      return sendResponse(
        res,
        false,
        "Max 4 photos allowed",
        [],
        "Limit Reached",
        400
      );
    }

    const photoUrls = [];
    for (const file of req.files) {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const url = await saveImage(file.buffer, userId, uniqueName);
      photoUrls.push(url);
    }

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId },
      { $push: { photos: { $each: photoUrls } } },
      { new: true, upsert: true }
    );

    const completion = calculateProfileCompletion(updatedProfile);
    return sendResponse(res, true, "Photos uploaded", {
      profile: updatedProfile,
      completionPercentage: completion,
    });
  } catch (err) {
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// 8️⃣ About Yourself
exports.aboutYourself = async (req, res) => {
  try {
    const { describeYourself, viewSample } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { describeYourself, viewSample },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    return sendResponse(res, true, "About yourself updated", {
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// 9️⃣ Add Interest
exports.addInterestData = async (req, res) => {
  try {
    const { addInterest } = req.body;
    if (!addInterest) {
      return sendResponse(
        res,
        false,
        "addInterest is required",
        [],
        "Validation Error",
        400
      );
    }
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { addInterest },
      { new: true, upsert: true }
    );
    return sendResponse(res, true, "Interest updated successfully", {
      profile,
    });
  } catch (error) {
    return sendResponse(res, false, "Server Error", [], error.message, 500);
  }
};

// 🔟 Get Profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await UserDetail.findOne({ user: req.user.id });
    if (!profile)
      return sendResponse(res, false, "Profile not found", [], null, 404);
    return sendResponse(res, true, "Profile fetched successfully", { profile });
  } catch (err) {
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// Utility function: check profile completion
function calculateProfileCompletionWithMissing(profile) {
  let totalFields = 0;
  let filledFields = 0;
  let missingFields = [];

  // Fields we want to check
  const fieldsToCheck = [
    "profileCreatingFor",
    "name",
    "dob",
    "gender",
    "motherTongue",
    "religion",
    "caste",
    "address",
    "state",
    "district",
    "city",
    "pincode",
    "height",
    "weight",
    "bodyType",
    "diet",
    "disability",
    "highestEducation",
    "professionType",
    "jobTitle",
    "fatherName",
    "fatherOccupation",
    "motherName",
    "motherOccupation",
    "siblingsCount",
    "familyStatus",
    "addInterest",
    "photos",
    "describeYourself",
  ];

  fieldsToCheck.forEach((field) => {
    totalFields++;
    if (
      profile[field] !== undefined &&
      profile[field] !== null &&
      profile[field] !== "" &&
      !(Array.isArray(profile[field]) && profile[field].length === 0)
    ) {
      filledFields++;
    } else {
      missingFields.push(field);
    }
  });

  const completionPercentage = Math.round((filledFields / totalFields) * 100);

  return { completionPercentage, missingFields };
}

exports.getCompletionPercentage = async (req, res) => {
  try {
    const profile = await UserDetail.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: null,
      });
    }

    const { completionPercentage, missingFields } =
      calculateProfileCompletionWithMissing(profile.toObject());

    return res.status(200).json({
      success: true,
      message: "Completion percentage fetched",
      data: {
        profile,
        completionPercentage,
        missingFields,
      },
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      data: [],
      error: err.message,
    });
  }
};

// -------------------- BASIC --------------------
exports.updateBasic = async (req, res) => {
  try {
    const { profileCreatingFor, name, gender, dob } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { profileCreatingFor, name, gender, dob },
      { new: true }
    );

    if (!updatedProfile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Basic updated",
      data: [updatedProfile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

exports.getBasic = async (req, res) => {
  try {
    const profile = await UserDetail.findOne(
      { userId: req.user.id },
      "profileCreatingFor name gender dob"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });
    }

    // format dob as DD-MM-YYYY
    const formattedProfile = {
      ...profile._doc,
      dob: profile.dob
        ? profile.dob.toISOString().split("T")[0].split("-").reverse().join("-")
        : null,
    };

    res.json({
      success: true,
      message: "Basic fetched",
      data: [formattedProfile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

// -------------------- DETAILS --------------------
exports.updateDetails = async (req, res) => {
  try {
    const { motherTongue, religion, caste } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { motherTongue, religion, caste },
      { new: true }
    );

    if (!updatedProfile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Details updated",
      data: [updatedProfile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

exports.getDetails = async (req, res) => {
  try {
    const profile = await UserDetail.findOne(
      { userId: req.user.id },
      "motherTongue religion caste "
    );
    if (!profile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Details fetched",
      data: [profile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

// -------------------- LOCATION --------------------
exports.updateLocation = async (req, res) => {
  try {
    const { city, state, country, address, district } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { city, state, country, address, district },
      { new: true }
    );

    if (!updatedProfile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Location updated",
      data: [updatedProfile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

exports.getLocation = async (req, res) => {
  try {
    const profile = await UserDetail.findOne(
      { userId: req.user.id },
      "city state address district pincode"
    );
    if (!profile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Location fetched",
      data: [profile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

// -------------------- PHYSICAL --------------------
exports.updatePhysical = async (req, res) => {
  try {
    const { height, weight, bodyType, diet, disability } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { height, weight, bodyType, diet, disability },
      { new: true }
    );

    if (!updatedProfile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Physical updated",
      data: [updatedProfile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

exports.getPhysical = async (req, res) => {
  try {
    const profile = await UserDetail.findOne(
      { userId: req.user.id },
      "height weight bodyType diet disability"
    );
    if (!profile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Physical fetched",
      data: [profile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

// -------------------- EDUCATION-JOB --------------------
exports.updateEducationJob = async (req, res) => {
  try {
    const { highestEducation, professionType, jobTitle } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { highestEducation, professionType, jobTitle },
      { new: true }
    );

    if (!updatedProfile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Education/Job updated",
      data: [updatedProfile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

exports.getEducationJob = async (req, res) => {
  try {
    const profile = await UserDetail.findOne(
      { userId: req.user.id },
      "highestEducation professionType jobTitle"
    );
    if (!profile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Education/Job fetched",
      data: [profile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

// -------------------- FAMILY --------------------
exports.updateFamily = async (req, res) => {
  try {
    const {
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      siblingsCount,
      familyStatus,
    } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      {
        fatherName,
        fatherOccupation,
        motherName,
        motherOccupation,
        siblingsCount,
        familyStatus,
      },
      { new: true }
    );

    if (!updatedProfile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Family updated",
      data: [updatedProfile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

exports.getFamily = async (req, res) => {
  try {
    const profile = await UserDetail.findOne(
      { userId: req.user.id },
      "fatherName fatherOccupation motherName motherOccupation siblingsCount familyStatus"
    );
    if (!profile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Family fetched",
      data: [profile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

// -------------------- PHOTOS --------------------
// helper: delete old photos
const deleteOldPhotos = (photos = []) => {
  photos.forEach((url) => {
    try {
      // extract path after base URL
      const relativePath = url.replace(BASE_URL, "");
      const filePath = path.join(BASE_DIR, relativePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // delete file
      }
    } catch (err) {
      console.error("Failed to delete photo:", err.message);
    }
  });
};

// PUT: replace all photos
exports.updatePhotos = async (req, res) => {
  try {
    const userId = req.user.id;

    // find existing profile
    const existingProfile = await UserDetail.findOne({ userId });
    if (!existingProfile) {
      return sendResponse(
        res,
        false,
        "Profile not found",
        [],
        "Not Found",
        404
      );
    }

    // remove old photos from filesystem
    if (existingProfile.photos && existingProfile.photos.length > 0) {
      deleteOldPhotos(existingProfile.photos);
    }

    // save new photos
    const photoUrls = [];
    for (const file of req.files) {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const url = await saveImage(file.buffer, userId, uniqueName);
      photoUrls.push(url);
    }

    // update DB
    existingProfile.photos = photoUrls;
    await existingProfile.save({ validateModifiedOnly: true });

    const completion = calculateProfileCompletion(existingProfile);
    return sendResponse(res, true, "Photos updated", {
      profile: existingProfile,
      completionPercentage: completion,
    });
  } catch (err) {
    console.error("updatePhotos error:", err);
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const profile = await UserDetail.findOne({ userId: req.user.id }, "photos");
    if (!profile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Photos fetched",
      data: [profile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

// -------------------- ABOUT --------------------
exports.updateAbout = async (req, res) => {
  try {
    const { describeYourself, viewSample } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { describeYourself, viewSample },
      { new: true }
    );

    if (!updatedProfile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "About updated",
      data: [updatedProfile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

exports.getAbout = async (req, res) => {
  try {
    const profile = await UserDetail.findOne(
      { userId: req.user.id },
      "describeYourself viewSample"
    );
    if (!profile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "About fetched",
      data: [profile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

// -------------------- INTEREST --------------------
exports.updateInterest = async (req, res) => {
  try {
    const { addInterest } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { addInterest },
      { new: true }
    );

    if (!updatedProfile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Interests updated",
      data: [updatedProfile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};

exports.getInterest = async (req, res) => {
  try {
    const profile = await UserDetail.findOne(
      { userId: req.user.id },
      "addInterest"
    );
    if (!profile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: [],
        error: "Not Found",
      });

    res.json({
      success: true,
      message: "Interests fetched",
      data: [profile],
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      error: error.message,
    });
  }
};
