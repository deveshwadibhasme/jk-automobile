import express from "express";
import auth from "../middleware/auth.js";
import { editCarList, getCarList, getModuleData, postCarList, postModuleData , deleteCarData } from "../controllers/data.controller.js";

const router = express.Router()

router.post('/post-car-data', auth, postCarList)
router.post('/post-module-data', auth, postModuleData)
router.post('/edit-car-data/:id', auth, editCarList)

router.delete('/delete-car-data/:id', auth, deleteCarData)

router.get('/get-car-data/:id', getCarList)
router.get('/get-module-data/:id', getModuleData)



export default router