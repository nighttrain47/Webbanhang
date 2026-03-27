const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hobbyshop_secret_key_2026';

// Create JWT token
const createToken = (payload, expiresIn = '24h') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ success: false, message: 'Token không được cung cấp' });
    }

    const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    try {
        const decoded = jwt.verify(bearerToken, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
    }
};

module.exports = { createToken, verifyToken, JWT_SECRET };
