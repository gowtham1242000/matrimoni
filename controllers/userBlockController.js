const UserBlock = require("../models/UserBlock");

exports.blockUser = async (req, res) => {
  try {
    const { id } = req.params; // userId
    const { block } = req.body; // true/false

    let record = await UserBlock.findOne({ userId: id });

    if (!record) {
      record = new UserBlock({
        userId: id,
        status: block ? "blocked" : "active",
        blockedAt: block ? new Date() : null,
      });
    } else {
      record.status = block ? "blocked" : "active";
      record.blockedAt = block ? new Date() : null;
    }

    await record.save();

    res.json({
      success: true,
      message: `User ${block ? "blocked" : "unblocked"} successfully`,
      data: record,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
