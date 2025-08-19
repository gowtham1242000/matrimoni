const UserDetail = require("../models/UserDetail");
const calculateProfileCompletion = require("./../utils/profileCompletion");

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

// 1️⃣ Create or Update Basic Info
exports.createOrUpdateBasic = async (req, res) => {
  try {
    const { profileCreatingFor, name, gender } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { profileCreatingFor, name, gender },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    return sendResponse(res, true, "Basic info updated", {
      profile,
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
      siblingsCounts,
      familyStatus,
    } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      {
        fatherName,
        fatherOccupation,
        motherName,
        motherOccupation,
        siblingsCounts,
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

// 7️⃣ Upload Photos
exports.uploadPhotos = async (req, res) => {
  try {
    const photoPaths = req.files.map((file) => file.path);
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { photos: { $each: photoPaths } } },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    return sendResponse(res, true, "Photos uploaded", {
      profile,
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

// 1️⃣1️⃣ Get Completion Percentage
exports.getCompletionPercentage = async (req, res) => {
  try {
    const profile = await UserDetail.findOne({ userId: req.user.id });
    if (!profile)
      return sendResponse(res, false, "Profile not found", [], null, 404);
    const completion = calculateProfileCompletion(profile);
    return sendResponse(res, true, "Completion percentage fetched", {
      completionPercentage: completion,
    });
  } catch (err) {
    return sendResponse(res, false, "Server Error", [], err.message, 500);
  }
};

// -------------------- BASIC --------------------
exports.updateBasic = async (req, res) => {
  try {
    const { profileCreatingFor, name, gender } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { profileCreatingFor, name, gender },
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
      "profileCreatingFor name gender"
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
      message: "Basic fetched",
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

// -------------------- DETAILS --------------------
exports.updateDetails = async (req, res) => {
  try {
    const { dob, maritalStatus, height, weight } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { dob, maritalStatus, height, weight },
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
      "dob maritalStatus height weight"
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
    const { city, state, country } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { city, state, country },
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
      "city state country"
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
    const { complexion, bodyType, disability } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { complexion, bodyType, disability },
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
      "complexion bodyType disability"
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
    const { education, occupation, income } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { education, occupation, income },
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
      "education occupation income"
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
    const { fatherName, motherName, siblings } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { fatherName, motherName, siblings },
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
      "fatherName motherName siblings"
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
exports.updatePhotos = async (req, res) => {
  try {
    const photoPaths = req.files.map((file) => file.path);

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { photos: photoPaths },
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
      message: "Photos updated",
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
    const { about } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { about },
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
    const profile = await UserDetail.findOne({ userId: req.user.id }, "about");
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
    const { interests } = req.body;

    const updatedProfile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { interests },
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
      "interests"
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
