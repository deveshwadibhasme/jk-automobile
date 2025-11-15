import express from "express";
import { userLogIn, userSignUp, verifyUserAndRegister } from "../controllers/auth.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router()

router.post('/user/log-in' , userLogIn)

router.post('/user/sign-up', userSignUp)
router.post('/user/verify-and-register', verifyUserAndRegister)

export default router