import pool from "../config/connect-db.js"
import { sendMail } from "../config/email.config.js"
import { nowIST, toMysqlDatetime } from "../utils/mysql-date.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const generateOtp = () => {
    return Math.round((Math.random() * 9000) + 1000)
}

const userSignUp = async (req, res) => {
    const { email } = req.body

    const [existing] = await pool.query('select * from user where email = ?', [email])

    if (existing.length > 0) return res.status(400).json({ message: 'User Already Exist' })

    try {
        const otp = generateOtp()
        const expire_at = nowIST()

        await sendMail({
            to: email,
            subject: "OTP for Verification",
            html: `Your OTP for registration J.K. Automobile is ${otp}`,
        })

        await pool.query('insert into otp_store (email,otp,expire_at) values (?,?,?)', [email, otp, expire_at])

        return res.status(200).json({ message: 'OTP Sent to Your Email' })

    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Server Error', error: error })
    }

}

const verifyUserAndRegister = async (req, res) => {
    const { name, email, mobile_no, password, otp } = req.body

    if (!name && !email && !mobile_no && !password && !otp) return res.status(400).json({ message: 'All Field are mandatory' })


    try {
        const [rows] = await pool.query(
            "SELECT otp, expire_at FROM otp_store WHERE email = ?",
            [email]
        );

        if (!rows.length) {
            return res.status(400).json({ message: 'Invalid or expired OTP. Verify Email Again' });

        }

        const nowUTC = new Date();
        const expired = nowUTC > new Date(rows[0].expire_at + 'Z');

        if (expired) {
            await pool.query('DELETE FROM otp_store WHERE email = ?', [email]);
            return res.status(400).json({ message: 'Invalid or expired OTP. Verify Email Again' });
        }

        if (otp !== rows[0].otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await pool.query('insert into user (name, email, mobile_no, password) values(?,?,?,?)', [name, email, mobile_no, hashedPassword])

        await pool.query('delete from otp_store where email = ?', [email])

        return res.status(200).json({ message: 'Registration Successfull' })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error })
    }

}

const userLogIn = async (req, res) => {
    const { email, password } = req.body

    if (!email && !password) return res.status(401).json({ message: 'All Field are mandatory' })

    try {
        const [existing] = await pool.query('select * from user where email = ?', [email])
        if (!existing.length > 0) return res.status(401).json({ message: 'Enter Valid Credentials' })

        const validPassword = await bcrypt.compare(password, existing[0].password)

        if (!validPassword) { return res.status(404).json({ message: 'Enter Valid Credentials' }) }

        const token = jwt.sign({ email: existing[0].email, name: existing[0].name }, process.env.JWT_SECRET, { expiresIn: '2h' })

        res.status(200).json({ message: 'Login Succesfully', token: token, username: existing[0].name })

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Server Error', error: error })
    }
}

const adminLogIn = async (req, res) => {
    const { email, password } = req.body

    if (!email && !password) return res.status(401).json({ message: 'All Field are mandatory' })

    try {
        const [existing] = await pool.query('select * from admin where email = ?', [email])
        if (!existing.length > 0) return res.status(401).json({ message: 'Enter Valid Credentials' })

        const validPassword = await bcrypt.compare(password, existing[0].password)

        if (!validPassword) { return res.status(404).json({ message: 'Enter Valid Credentials' }) }

        const token = jwt.sign({ email: existing[0].email, name: existing[0].name }, process.env.JWT_SECRET, { expiresIn: '2h' })

        res.status(200).json({ message: 'Welcome Admin', token: token, role: 'admin' })

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Server Error', error: error })
    }
}

const adminRegister = async (req, res) => {
    const { name, email, password } = req.body

    if (!name && !email && !password) return res.status(400).json({ message: 'All Field are mandatory' })


    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        await pool.query('insert into admin (name, email, password) values(?,?,?)', [name, email, hashedPassword])


        return res.status(200).json({ message: 'Registration Successfull' })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error })
    }

}



export { userLogIn, userSignUp, verifyUserAndRegister, adminLogIn, adminRegister }
