import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json([{ message: 'You are not autheticated' }])
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json([{ message: 'You are not autheticated' }])
            req.user = user
            next()
        })
    } catch (error) {
        return res.json([{ message: 'Server Error' }])
    }
}

export default auth
