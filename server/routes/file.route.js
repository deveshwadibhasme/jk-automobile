import express  from "express";
import { downloadBin, getFileData, postFileData } from "../controllers/file.controller.js";

const router = express.Router()

router.post('/post-file-data', postFileData)

router.get('/get-file-data/:id', getFileData)

router.post('/download-bin', downloadBin)

export default router