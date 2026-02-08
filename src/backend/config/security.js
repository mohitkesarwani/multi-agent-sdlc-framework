/**
 * Security Configuration
 * Centralizes security settings for the application
 */

require('dotenv').config();

const securityConfig = {
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_min_32_chars',
        expiresIn: process.env.JWT_EXPIRY || '7d',
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret_here_min_32_chars',
        algorithm: 'HS256'
    },

    // Password Configuration
    password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        saltRounds: 10
    },

    // CORS Configuration
    cors: {
        origin: process.env.API_CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
        optionsSuccessStatus: 200
    },

    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.'
    },

    // Security Headers (Helmet configuration)
    helmet: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:']
            }
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        }
    },

    // Session Configuration
    session: {
        secret: process.env.SESSION_SECRET || 'your_session_secret_here',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    },

    // Security Audit Settings
    audit: {
        enabled: process.env.ENABLE_SECURITY_AUDIT === 'true',
        logLevel: process.env.AGENT_LOG_LEVEL || 'info',
        logDir: process.env.LOG_DIR || './logs'
    }
};

module.exports = securityConfig;
