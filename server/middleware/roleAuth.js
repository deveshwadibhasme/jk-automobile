
const roleAuth = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!roles.includes(user.role)) {
            return res.status(401).json({ message: 'You are not authorised' })
        }
        next();
    }
}

export default roleAuth