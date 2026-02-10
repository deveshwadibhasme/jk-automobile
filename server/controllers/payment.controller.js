import crypto from "crypto";
import dotenv from 'dotenv'
import razorpay from '../config/rzp.config.js'
import pool from "../config/connect-db.js";
dotenv.config()

const createCheckOut = async (req, res) => {
    const { id } = req.body
    const user = req.user

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows] = await connection.query('select file_price, file_id, car_id from file_store where id = ?', [id])
        const [userInfo] = await connection.query('select id, name, email, mobile_no from user where email = ?', [user.email])

        const options = {
            amount: rows[0].file_price * 100,
            currency: 'INR',
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };

        await connection.query('delete from transaction where user_id = ? AND order_id IS NULL', [userInfo[0].id])
        await connection.query('insert into transaction (user_id,module_id,price) values(?,?,?)', [userInfo[0].id, id, rows[0].file_price])
        await connection.query('insert into car_file (user_id,car_file_id,file_price,car_id) values(?,?,?,?)', [userInfo[0].id, rows[0].file_id, rows[0].file_price, rows[0].car_id])

        const order = await razorpay.orders.create(options);

        await connection.commit();
        res.status(200).json([order, userInfo[0]]);
    } catch (err) {
        await connection.rollback();
        console.log(err);
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
}

const verifyCheckOut = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const user = req.user
        const [userId] = await connection.query('select id from user where email = ?', [user.email])

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
            .update(sign)
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            await connection.query('update transaction set order_id = ? where user_id = ? AND order_id IS NULL', [razorpay_order_id, userId[0].id])
            await connection.commit();
            res.status(200).json({ type: 'success', message: 'Payment verified successfully', order: razorpay_order_id });
        } else {
            await connection.rollback();
            res.status(400).json({ error: 'Invalid payment signature' });
        }
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
}

export { createCheckOut, verifyCheckOut }