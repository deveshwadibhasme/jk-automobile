import express from "express";
import { adminLogIn, adminRegister, userLogIn, userSignUp, verifyUserAndRegister } from "../controllers/auth.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router()

router.post('/user/log-in' , userLogIn)

router.post('/user/sign-up', userSignUp)
router.post('/user/verify-and-register', verifyUserAndRegister)

router.post('/admin/register', adminRegister)
router.post('/admin/login', adminLogIn)

export default router