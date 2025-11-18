import express from "express";
import auth from "../middleware/auth.js";
import { postCarList } from "../controllers/data.controller.js";

const router = express.Router()

router.post('/post-car-data', auth, postCarList)


export default router