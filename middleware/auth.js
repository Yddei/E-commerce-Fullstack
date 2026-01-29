const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    //secret has to be declared here in case this auth.js file loads before the .env file
    const secret = process.env.JWT_SECRET; 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, secret);
        req.user = verified; 
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = authenticateToken;