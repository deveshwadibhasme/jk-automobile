import express from "express";
import auth from "../middleware/auth.js";
import roleAuth from "../middleware/roleAuth.js";
import { editCarList, getCarList, getModuleData, postCarList, postModuleData, deleteCarData } from "../controllers/data.controller.js";

const router = express.Router()

router.post('/post-car-data', auth, roleAuth(['admin']), postCarList)
router.post('/post-module-data', auth, roleAuth(['admin']), postModuleData)
router.post('/edit-car-data/:id', auth, roleAuth(['admin']), editCarList)

router.delete('/delete-car-data/:id', auth, roleAuth(['admin']), deleteCarData)

router.get('/get-car-data/:id/:page/:limit', getCarList)
router.get('/get-module-data/:id', getModuleData)



export default router