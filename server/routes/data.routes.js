import express from "express";
import auth from "../middleware/auth.js";
import { getCarList, postCarList } from "../controllers/data.controller.js";

const router = express.Router()

router.post('/post-car-data', auth, postCarList)

router.get('/get-car-data', getCarList)


export default router