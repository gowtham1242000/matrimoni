const mongoose = require("mongoose");

const userDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    motherTongue: { type: String, required: true },
    religion: { type: String, required: true },
    caste: { type: String, required: true },

    country: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    pinCode: { type: String, required: true },

    height: { type: String }, // e.g., "5ft 8in" or cm
    weight: { type: String }, // e.g., "70kg"
    bodyType: { type: String }, // e.g., Slim, Athletic, Heavy
    diet: { type: String }, // Vegetarian, Non-Vegetarian, etc.
    disability: { type: String }, // "None" or describe

    highestEducation: { type: String },
    professionType: { type: String },
    jobTitle: { type: String },
    salaryLevel: { type: String }, // Could be a range like "<5L", "5L-10L", etc.

    motherOccupation: { type: String },
    fatherOccupation: { type: String },
    numberOfBrothers: { type: Number, default: 0 },
    numberOfSisters: { type: Number, default: 0 },
    familyStatus: { type: String }, // Joint/Nuclear/Other

    interests: [{ type: String }], // Can be multiple
    photo: { type: String }, // image URL or filename
    descriptionYourself: { type: String },
    samples: [{ type: String }], // image URLs, audio, or other media
    suggestion: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserDetail", userDetailSchema);
