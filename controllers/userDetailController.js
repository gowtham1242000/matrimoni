const UserDetail = require("../models/UserDetail");
const User = require("../models/User");

exports.createUserDetail = async (req, res) => {
  try {
    const {
      userId,
      motherTongue,
      religion,
      caste,
      country,
      state,
      district,
      city,
      pinCode,
      height,
      weight,
      bodyType,
      diet,
      disability,
      highestEducation,
      professionType,
      jobTitle,
      salaryLevel,
      motherOccupation,
      fatherOccupation,
      numberOfBrothers,
      numberOfSisters,
      familyStatus,
      interests,
      descriptionYourself,
      suggestion,
      samples,
    } = req.body;

    const photoUrl = req.file ? "https://dummyurl.com/image.jpg" : ""; // placeholder if no file uploaded

    const newDetail = new UserDetail({
      userId,
      motherTongue,
      religion,
      caste,
      country,
      state,
      district,
      city,
      pinCode,
      height,
      weight,
      bodyType,
      diet,
      disability,
      highestEducation,
      professionType,
      jobTitle,
      salaryLevel,
      motherOccupation,
      fatherOccupation,
      numberOfBrothers,
      numberOfSisters,
      familyStatus,
      interests: interests ? interests.split(",") : [],
      photo: photoUrl,
      descriptionYourself,
      samples: samples ? samples.split(",") : [],
      suggestion,
    });

    await newDetail.save();

    res
      .status(201)
      .json({ msg: "User detail saved successfully", data: newDetail });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserDetailByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user and user details
    const user = await User.findById(userId).lean(); // base user info
    const userDetail = await UserDetail.findOne({ userId }).lean(); // extended info

    if (!user || !userDetail) {
      return res.status(404).json({ msg: "User or details not found" });
    }

    // Combine both
    const fullProfile = {
      ...user,
      details: userDetail,
    };

    res.json({ msg: "User detail fetched successfully", data: fullProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};
