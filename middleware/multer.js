const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});


const parseImage = (fieldName) => upload.single(fieldName);

const parseImages = (fieldName, maxCount = 5) =>
  upload.array(fieldName, maxCount);

module.exports = { parseImage, parseImages };