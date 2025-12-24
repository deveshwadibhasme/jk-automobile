import crypto from "crypto";
import dotenv from 'dotenv'
import razorpay from '../config/rzp.config.js'
import pool from "../config/connect-db.js";
dotenv.config()

const createCheckOut = async (req, res) => {
    const { id } = req.body
    const user = req.user

    const [rows] = await pool.query('select file_price from file_store where id = ?', [id])
    // await pool.query('insert into trasaction')
    
    try {
        const options = {
            amount: rows[0].file_price * 100,
            currency: 'INR',
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

const verifyCheckOut = (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
            .update(sign)
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            res.status(200).json({ type: 'success', message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ error: 'Invalid payment signature' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export { createCheckOut, verifyCheckOut }