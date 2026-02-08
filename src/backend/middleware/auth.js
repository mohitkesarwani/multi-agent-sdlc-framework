const jwt = require('jsonwebtoken');

// Secret key for JWT signing and encryption
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Middleware for JWT authentication
const authMiddleware = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    if (!token) return res.sendStatus(403); // Forbidden if no token

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid or expired

        req.user = user; // Attach user info to request
        next(); // Proceed to the next middleware or route
    });
};

// Role-based access control middleware
const roleAuthorization = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.sendStatus(403); // Forbidden if user role is not allowed
        }
        next(); // Proceed to the next middleware or route
    };
};

module.exports = { authMiddleware, roleAuthorization };