import express from "express";
import { downloadBin, getFileData, postFileData } from "../controllers/file.controller.js";
import auth from '../middleware/auth.js'
import roleAuth from "../middleware/roleAuth.js";

const router = express.Router()

// router.post('/post-file-data', postFileData)

router.get('/get-file-data/:id', getFileData)

router.get('/download-bin/:id/:order', auth, roleAuth(['user']), downloadBin)

export default router