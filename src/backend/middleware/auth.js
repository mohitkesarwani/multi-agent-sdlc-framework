const jwt = require('jsonwebtoken');
const securityConfig = require('../config/security');

// Middleware for JWT authentication
const authMiddleware = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(401).json({ 
            error: 'Unauthorized', 
            message: 'No token provided' 
        });
    }

    jwt.verify(token, securityConfig.jwt.secret, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                error: 'Forbidden', 
                message: 'Invalid or expired token' 
            });
        }

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

module.exports = { 
    authMiddleware, 
    authenticate: authMiddleware, // Alias for convenience
    roleAuthorization 
};