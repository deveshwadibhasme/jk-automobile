import express from "express";
import { downloadBin, getFileData, postFileData } from "../controllers/file.controller.js";
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/post-file-data', postFileData)

router.get('/get-file-data/:id', getFileData)

router.get('/download-bin/:id/:order', auth, downloadBin)

export default router