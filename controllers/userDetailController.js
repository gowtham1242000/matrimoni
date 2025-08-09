const UserDetail = require("../models/UserDetail");
const calculateProfileCompletion = require("./../utils/profileCompletion");

// Create or update basic info
exports.createOrUpdateBasic = async (req, res) => {
  try {
    const { profileCreatingFor, name, gender } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { profileCreatingFor, name, gender },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    res.json({
      msg: "Basic info updated",
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.basicDetails = async (req, res) => {
  try {
    const { motherTongue, religion, caste } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { motherTongue, religion, caste },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    res.json({
      msg: "Details updated",
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.locationDetails = async (req, res) => {
  try {
    const { address, city, state, district, pincode } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { address, state, district, city, pincode },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    res.json({
      msg: "Location updated",
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.physicalDetails = async (req, res) => {
  try {
    const { height, weight, bodyType, diet, disability } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { height, weight, bodyType, diet, disability },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    res.json({
      msg: "Physical details updated",
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.educationJob = async (req, res) => {
  try {
    const { highestEducation, jobTitle, professionType } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { highestEducation, jobTitle, professionType },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    res.json({
      msg: "Education & Job details updated",
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

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
    res.json({
      msg: "Family details updated",
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.uploadPhotos = async (req, res) => {
  try {
    const photoPaths = req.files.map((file) => file.path);
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { photos: { $each: photoPaths } } },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    res.json({
      msg: "Photos uploaded",
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.aboutYourself = async (req, res) => {
  try {
    const { describeYourself, viewSample } = req.body;
    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id },
      { describeYourself, viewSample },
      { new: true, upsert: true }
    );
    const completion = calculateProfileCompletion(profile);
    res.json({
      msg: "About yourself updated",
      profile,
      completionPercentage: completion,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
exports.addInterestData = async (req, res) => {
  try {
    const { addInterest } = req.body;

    if (!addInterest) {
      return res.status(400).json({ msg: "addInterest is required" });
    }

    const profile = await UserDetail.findOneAndUpdate(
      { userId: req.user.id }, // coming from auth middleware
      { addInterest }, // Replace old interests
      { new: true, upsert: true }
    );

    res.json({
      msg: "Interest updated successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await UserDetail.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getCompletionPercentage = async (req, res) => {
  try {
    const profile = await UserDetail.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ msg: "Profile not found" });

    const completion = calculateProfileCompletion(profile);
    res.json({ completionPercentage: completion });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
