// utils/profileCompletion.js
function calculateProfileCompletion(userDetail) {
  const fields = [
    // Step 1 - Basic
    "profileCreatingFor",
    "name",
    "gender",

    // Basic Details
    "motherTongue",
    "religion",
    "caste",

    // Location Details
    "address",
    "state",
    "district",
    "city",
    "pincode",

    // Physical
    "height",
    "weight",
    "bodyType",
    "diet",
    "disability",

    // Education/Job
    "highestEducation",
    "professionType",
    "jobTitle",

    // Family
    "fatherName",
    "fatherOccupation",
    "motherName",
    "motherOccupation",
    "siblingsCount",
    "familyStatus",

    // Interests
    "addInterest",

    // Photos
    "photos",

    // About
    "describeYourself",
    "viewSample",
  ];

  let filledCount = 0;
  fields.forEach((field) => {
    const value = userDetail[field];
    if (Array.isArray(value)) {
      if (value.length > 0) filledCount++;
    } else if (value !== null && value !== undefined && value !== "") {
      filledCount++;
    }
  });

  const percentage = Math.round((filledCount / fields.length) * 100);
  return percentage;
}

module.exports = calculateProfileCompletion;
