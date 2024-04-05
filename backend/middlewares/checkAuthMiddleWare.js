const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log(token)
        if (!token) {
            return res.status(401).json({ message: "Auth Error: Token not provided" });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Auth Error: Invalid Token" });
        }

        // Verify the token

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // Attach the decoded user information to the request object
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = authenticateToken;