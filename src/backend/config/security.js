/**
 * Security Configuration Module
 * 
 * Centralizes all security-related configurations including:
 * - CORS settings
 * - Helmet security headers
 * - Rate limiting
 * - Content Security Policy
 * - Authentication settings
 * 
 * @module config/security
 */

const rateLimit = require('express-rate-limit');

/**
 * CORS Configuration
 * Controls which domains can access the API
 */
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:5173'];
    
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
};

/**
 * Helmet Configuration
 * Sets various HTTP headers for security
 */
const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'deny',
  },
  noSniff: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
};

/**
 * Rate Limiting Configuration
 * Prevents brute force attacks and API abuse
 */
const rateLimitOptions = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Store rate limit data in memory (use Redis in production)
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime - Date.now()) / 1000,
    });
  },
};

/**
 * Strict Rate Limiting for Authentication Endpoints
 * Prevents credential stuffing and brute force attacks
 */
const authRateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  skipSuccessfulRequests: false,
  message: 'Too many authentication attempts, please try again later.',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again in 15 minutes.',
    });
  },
};

/**
 * JWT Configuration
 */
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  algorithm: 'HS256',
  issuer: 'multi-agent-sdlc',
  audience: 'multi-agent-sdlc-api',
};

/**
 * Password Policy Configuration
 */
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
};

/**
 * Security Headers Configuration
 * Additional custom security headers
 */
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

/**
 * Trusted Proxies Configuration
 * Configure if behind reverse proxy (nginx, load balancer)
 */
const trustedProxies = process.env.TRUSTED_PROXIES
  ? process.env.TRUSTED_PROXIES.split(',')
  : [];

/**
 * Input Sanitization Rules
 */
const sanitizationRules = {
  allowedTags: [], // No HTML tags allowed by default
  allowedAttributes: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style'],
};

/**
 * Session Configuration (if using sessions)
 */
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict',
  },
};

/**
 * File Upload Security
 */
const fileUploadConfig = {
  maxFileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024, // Convert MB to bytes
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  uploadPath: process.env.UPLOAD_PATH || './uploads',
};

module.exports = {
  corsOptions,
  helmetOptions,
  rateLimitOptions,
  authRateLimitOptions,
  jwtConfig,
  passwordPolicy,
  securityHeaders,
  trustedProxies,
  sanitizationRules,
  sessionConfig,
  fileUploadConfig,
  
  // Create rate limiter instances
  createRateLimiter: () => rateLimit(rateLimitOptions),
  createAuthRateLimiter: () => rateLimit(authRateLimitOptions),
};
