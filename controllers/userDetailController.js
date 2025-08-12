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
