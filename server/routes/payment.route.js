import express from "express";
import { createCheckOut, verifyCheckOut } from "../controllers/payment.controller.js";
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/check-out', auth, createCheckOut)

router.post('/verify-payment', auth, verifyCheckOut)



export default router