// controllers/astroController.js
const {
  generateBirthChart,
  checkMarriageCompatibility,
} = require("../services/astro");

exports.getBirthChart = async (req, res) => {
  try {
    const { name, date, time, latitude, longitude, timezone } = req.body;

    // Validate required fields
    if (!name || !date || !time || !latitude || !longitude || !timezone) {
      return res.status(400).json({
        status: false,
        message:
          "Missing required fields: name, date, time, latitude, longitude, timezone",
      });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        status: false,
        message: "Invalid date format. Expected format: YYYY-MM-DD",
      });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        status: false,
        message: "Invalid time format. Expected format: HH:MM",
      });
    }

    const chart = generateBirthChart({
      name,
      date,
      time,
      latitude,
      longitude,
      timezone,
    });

    console.log("Generated chart:", chart);

    res.status(200).json({
      status: true,
      message: "Birth chart generated successfully",
      data: chart,
    });
  } catch (error) {
    console.error("Error in getBirthChart:", error.message);
    res.status(500).json({
      status: false,
      message: "Error generating birth chart",
      error: error.message,
    });
  }
};

exports.checkCompatibility = async (req, res) => {
  try {
    const { bride, groom, userId } = req.body;

    // Validate required fields
    if (!bride || !groom || !userId) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields: bride, groom, userId",
      });
    }

    // Validate bride and groom data structure
    const requiredPersonFields = [
      "name",
      "date",
      "time",
      "latitude",
      "longitude",
      "timezone",
    ];

    for (const field of requiredPersonFields) {
      if (!bride[field]) {
        return res.status(400).json({
          status: false,
          message: `Missing bride field: ${field}`,
        });
      }
      if (!groom[field]) {
        return res.status(400).json({
          status: false,
          message: `Missing groom field: ${field}`,
        });
      }
    }

    const result = checkMarriageCompatibility(bride, groom, userId);

    res.status(200).json({
      status: true,
      message: "Compatibility check completed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in checkCompatibility:", error.message);
    res.status(500).json({
      status: false,
      message: "Error checking compatibility",
      error: error.message,
    });
  }
};
