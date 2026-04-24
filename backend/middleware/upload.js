const multer = require('multer');

// Use memory storage — we pipe to Cloudinary manually so we can
// control the upload (no file written to disk).
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/i;
  if (allowed.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPEG, JPG, PNG, and WebP images are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;