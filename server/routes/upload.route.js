import express from "express";
import { upload } from "../middleware/upload.js";
import { updateFile, uploadFile } from "../controllers/upload.controller.js";
import auth from "../middleware/auth.js";
import roleAuth from "../middleware/roleAuth.js";

const router = express.Router();

router.post("/upload", upload.array("file"), auth, roleAuth(['admin']), uploadFile)


// router.put("/update-file/:fileId", upload.single("file"), updateFile);

export default router;
