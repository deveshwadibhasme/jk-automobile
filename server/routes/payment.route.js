import express from "express";
import { createCheckOut, verifyCheckOut } from "../controllers/payment.controller.js";
import auth from '../middleware/auth.js'
import roleAuth from "../middleware/roleAuth.js";

const router = express.Router()

router.post('/check-out', auth, roleAuth(['user']), createCheckOut)

router.post('/verify-payment', auth, roleAuth(['user']), verifyCheckOut)



export default router