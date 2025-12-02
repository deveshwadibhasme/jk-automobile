import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),   // we will upload buffer to ImageKit
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
