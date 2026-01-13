import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),   // we will upload buffer to ImageKit
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, '/var/www/uploads');
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, name);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
//   if (!allowed.includes(file.mimetype)) {
//     return cb(new Error('Invalid file type'), false);
//   }
//   cb(null, true);
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter
// });

// module.exports = upload;



