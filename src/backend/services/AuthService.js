/**
 * Authentication Service
 * Handles business logic for user authentication and authorization
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const securityConfig = require('../config/security');

class AuthService {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Created user object
     */
    async register(userData) {
        try {
            const { username, email, password, role } = userData;

            // Check if user already exists
            const existingUser = await User.findOne({ 
                $or: [{ email }, { username }] 
            });

            if (existingUser) {
                throw new Error('User with this email or username already exists');
            }

            // Validate password strength
            this.validatePassword(password);

            // Hash password
            const hashedPassword = await bcrypt.hash(
                password, 
                securityConfig.password.saltRounds
            );

            // Create new user
            const user = new User({
                username,
                email,
                password: hashedPassword,
                role: role || 'user'
            });

            await user.save();

            // Remove password from response
            const userObject = user.toObject();
            delete userObject.password;

            return userObject;
        } catch (error) {
            throw new Error(`Registration failed: ${error.message}`);
        }
    }

    /**
     * Authenticate user and generate tokens
     * @param {string} username - Username or email
     * @param {string} password - User password
     * @returns {Promise<Object>} Authentication tokens and user data
     */
    async login(username, password) {
        try {
            // Find user by username or email
            const user = await User.findOne({
                $or: [{ username }, { email: username }]
            });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            // Generate tokens
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Remove password from response
            const userObject = user.toObject();
            delete userObject.password;

            return {
                user: userObject,
                accessToken,
                refreshToken
            };
        } catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    /**
     * Refresh access token
     * @param {string} refreshToken - Refresh token
     * @returns {Promise<Object>} New access token
     */
    async refreshToken(refreshToken) {
        try {
            // Verify refresh token
            const decoded = jwt.verify(
                refreshToken, 
                securityConfig.jwt.refreshTokenSecret
            );

            // Find user
            const user = await User.findById(decoded.userId);

            if (!user) {
                throw new Error('User not found');
            }

            // Generate new access token
            const accessToken = this.generateAccessToken(user);

            return { accessToken };
        } catch (error) {
            throw new Error(`Token refresh failed: ${error.message}`);
        }
    }

    /**
     * Logout user (invalidate tokens)
     * @param {string} userId - User ID
     * @returns {Promise<void>}
     */
    async logout(userId) {
        try {
            // In a production app, you might want to:
            // 1. Add tokens to a blacklist
            // 2. Clear refresh tokens from database
            // 3. Log the logout event
            
            const user = await User.findById(userId);
            if (user) {
                user.lastLogout = new Date();
                await user.save();
            }
        } catch (error) {
            throw new Error(`Logout failed: ${error.message}`);
        }
    }

    /**
     * Generate access token
     * @param {Object} user - User object
     * @returns {string} JWT access token
     */
    generateAccessToken(user) {
        return jwt.sign(
            { 
                userId: user._id, 
                username: user.username,
                email: user.email,
                role: user.role 
            },
            securityConfig.jwt.secret,
            { 
                expiresIn: securityConfig.jwt.expiresIn,
                algorithm: securityConfig.jwt.algorithm
            }
        );
    }

    /**
     * Generate refresh token
     * @param {Object} user - User object
     * @returns {string} JWT refresh token
     */
    generateRefreshToken(user) {
        return jwt.sign(
            { userId: user._id },
            securityConfig.jwt.refreshTokenSecret,
            { 
                expiresIn: '30d',
                algorithm: securityConfig.jwt.algorithm
            }
        );
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @throws {Error} If password doesn't meet requirements
     */
    validatePassword(password) {
        const config = securityConfig.password;

        if (password.length < config.minLength) {
            throw new Error(`Password must be at least ${config.minLength} characters long`);
        }

        if (config.requireUppercase && !/[A-Z]/.test(password)) {
            throw new Error('Password must contain at least one uppercase letter');
        }

        if (config.requireLowercase && !/[a-z]/.test(password)) {
            throw new Error('Password must contain at least one lowercase letter');
        }

        if (config.requireNumbers && !/\d/.test(password)) {
            throw new Error('Password must contain at least one number');
        }

        if (config.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            throw new Error('Password must contain at least one special character');
        }
    }

    /**
     * Verify JWT token
     * @param {string} token - JWT token
     * @returns {Object} Decoded token payload
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, securityConfig.jwt.secret);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Change user password
     * @param {string} userId - User ID
     * @param {string} oldPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<void>}
     */
    async changePassword(userId, oldPassword, newPassword) {
        try {
            const user = await User.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            // Verify old password
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

            if (!isPasswordValid) {
                throw new Error('Current password is incorrect');
            }

            // Validate new password
            this.validatePassword(newPassword);

            // Hash new password
            user.password = await bcrypt.hash(
                newPassword, 
                securityConfig.password.saltRounds
            );

            await user.save();
        } catch (error) {
            throw new Error(`Password change failed: ${error.message}`);
        }
    }
}

module.exports = new AuthService();
