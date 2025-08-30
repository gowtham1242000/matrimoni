const UserVerification = require("../models/UserVerification");

exports.verifyProfile = async (req, res) => {
  try {
    const { id } = req.params; // userId
    const { verify } = req.body; // true/false

    let record = await UserVerification.findOne({ userId: id });

    if (!record) {
      record = new UserVerification({
        userId: id,
        isVerified: verify,
        verifiedAt: verify ? new Date() : null,
      });
    } else {
      record.isVerified = verify;
      record.verifiedAt = verify ? new Date() : null;
    }

    await record.save();

    res.json({
      success: true,
      message: `User profile ${
        verify ? "verified" : "unverified"
      } successfully`,
      data: record,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
