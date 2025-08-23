const mongoose = require("mongoose");

const userDetailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Step 1 - Basic
  profileCreatingFor: { type: String, trim: true },
  name: { type: String, trim: true },
  gender: { type: String, trim: true },

  // Basic Details
  motherTongue: { type: String, trim: true },
  religion: { type: String, trim: true },
  caste: { type: String, trim: true },

  // Location Details
  address: { type: String, trim: true },
  state: { type: String, trim: true },
  district: { type: String, trim: true },
  city: { type: String, trim: true },
  pincode: { type: String, trim: true },

  // Physical
  height: { type: String, trim: true },
  weight: { type: Number },
  bodyType: { type: String, trim: true },
  diet: { type: String, trim: true },
//  disability: { type: String, enum: ["Yes", "No"], default: "No" },
  disability: { type: String, enum: ["Yes", "No", "yes", "no"] },

  // Education/Job
  highestEducation: { type: String, trim: true },
  professionType: { type: String, trim: true },
  jobTitle: { type: String, trim: true },

  // Family
  fatherName: { type: String, trim: true },
  fatherOccupation: { type: String, trim: true },
  motherName: { type: String, trim: true },
  motherOccupation: { type: String, trim: true },
  siblingsCount: { type: Number },
  familyStatus: { type: String, trim: true },

  // Interests (multiple)
  addInterest: {
    type: [String],
    enum: ["Creative & Artistic", "Entertainment & Media", "Sports & Outdoor"],
  },

  // Photos
  photos: [{ type: String }], // paths or URLs

  // About
  describeYourself: { type: String, trim: true },
  viewSample: { type: String, trim: true },

  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserDetail", userDetailSchema);
