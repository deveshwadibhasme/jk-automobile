import express from "express";
import { upload } from "../middleware/upload.js";
import { updateFile, uploadFile } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/upload", upload.array("file"), uploadFile)


// router.put("/update-file/:fileId", upload.single("file"), updateFile);

export default router;
