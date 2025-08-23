const multer = require("multer");

// For now, we'll just parse the file and ignore saving
const storage = multer.memoryStorage(); // or use diskStorage if saving

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

module.exports = upload;
