import pool from "../config/connect-db.js"
import transporter from "../config/email.config.js"
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

        await transporter.sendMail({
            subject: 'OTP for Verification',
            to: email,
            html: `Your OTP for registration J.K. Automobile is ${otp}`
        })

        await pool.query('insert into otp_store (email,otp) values (?,?)', [email, otp])

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
        const [rows] =
            await pool.query(`SELECT email, otp FROM otp_store WHERE email = ? AND otp = ? AND NOW() < expire_at`, [email, otp])

        if (rows.length <= 0) {
            await pool.query('delete from otp_store where email = ?', [email])
            return res.status(400).json({ message: 'Invalid or expired OTP. Verify Email Again' });
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

        res.status(200).json({ message: 'Login Succesfully', token: token })

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Server Error', error: error })
    }
}

export { userLogIn, userSignUp, verifyUserAndRegister }
