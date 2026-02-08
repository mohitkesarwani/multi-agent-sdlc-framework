/**
 * Authentication Service
 * 
 * Handles all authentication-related business logic including:
 * - User registration
 * - User login/logout
 * - Token generation and validation
 * - Password hashing and verification
 * - Refresh token management
 * 
 * @module services/AuthService
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtConfig, passwordPolicy } = require('../config/security');

class AuthService {
  /**
   * Register a new user
   * 
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.name - User name
   * @param {string} userData.role - User role (optional)
   * @returns {Promise<Object>} Created user object (without password)
   * @throws {Error} If email already exists or validation fails
   */
  async register(userData) {
    const { email, password, name, role = 'user' } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate password policy
    this.validatePassword(password);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, passwordPolicy.bcryptRounds);

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
    });

    await user.save();

    // Return user without password
    return this.sanitizeUser(user);
  }

  /**
   * Authenticate user and generate tokens
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication result with tokens and user data
   * @throws {Error} If credentials are invalid
   */
  async login(email, password) {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw new Error('Account is not active');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   * 
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New access token
   * @throws {Error} If refresh token is invalid
   */
  async refreshAccessToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || user.status !== 'active') {
        throw new Error('Invalid refresh token');
      }

      // Generate new access token
      const accessToken = this.generateAccessToken(user);

      return {
        accessToken,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Change user password
   * 
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   * @throws {Error} If current password is incorrect or new password is invalid
   */
  async changePassword(userId, currentPassword, newPassword) {
    // Find user
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    this.validatePassword(newPassword);

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error('New password must be different from current password');
    }

    // Hash and update password
    user.password = await bcrypt.hash(newPassword, passwordPolicy.bcryptRounds);
    await user.save();
  }

  /**
   * Request password reset (generates reset token)
   * 
   * @param {string} email - User email
   * @returns {Promise<string>} Password reset token
   * @throws {Error} If user not found
   */
  async requestPasswordReset(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists (security best practice)
      return null;
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id, type: 'password-reset' },
      jwtConfig.secret,
      { expiresIn: '1h' }
    );

    // In production, send this token via email instead of returning it
    return resetToken;
  }

  /**
   * Reset password using reset token
   * 
   * @param {string} resetToken - Password reset token
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   * @throws {Error} If token is invalid or password is invalid
   */
  async resetPassword(resetToken, newPassword) {
    try {
      // Verify reset token
      const decoded = jwt.verify(resetToken, jwtConfig.secret);
      
      if (decoded.type !== 'password-reset') {
        throw new Error('Invalid token type');
      }

      // Find user
      const user = await User.findById(decoded.userId).select('+password');
      if (!user) {
        throw new Error('User not found');
      }

      // Validate new password
      this.validatePassword(newPassword);

      // Hash and update password
      user.password = await bcrypt.hash(newPassword, passwordPolicy.bcryptRounds);
      await user.save();
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }

  /**
   * Validate password against policy
   * 
   * @param {string} password - Password to validate
   * @throws {Error} If password doesn't meet policy requirements
   */
  validatePassword(password) {
    if (password.length < passwordPolicy.minLength) {
      throw new Error(`Password must be at least ${passwordPolicy.minLength} characters long`);
    }

    if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    if (passwordPolicy.requireNumbers && !/\d/.test(password)) {
      throw new Error('Password must contain at least one number');
    }

    if (passwordPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new Error('Password must contain at least one special character');
    }
  }

  /**
   * Generate JWT access token
   * 
   * @param {Object} user - User object
   * @returns {string} JWT access token
   */
  generateAccessToken(user) {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        type: 'access',
      },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expiresIn,
        algorithm: jwtConfig.algorithm,
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      }
    );
  }

  /**
   * Generate JWT refresh token
   * 
   * @param {Object} user - User object
   * @returns {string} JWT refresh token
   */
  generateRefreshToken(user) {
    return jwt.sign(
      {
        userId: user._id,
        type: 'refresh',
      },
      jwtConfig.refreshSecret,
      {
        expiresIn: jwtConfig.refreshExpiresIn,
        algorithm: jwtConfig.algorithm,
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      }
    );
  }

  /**
   * Verify JWT token
   * 
   * @param {string} token - JWT token to verify
   * @param {string} type - Token type ('access' or 'refresh')
   * @returns {Object} Decoded token payload
   * @throws {Error} If token is invalid
   */
  verifyToken(token, type = 'access') {
    const secret = type === 'refresh' ? jwtConfig.refreshSecret : jwtConfig.secret;
    return jwt.verify(token, secret);
  }

  /**
   * Remove sensitive data from user object
   * 
   * @param {Object} user - User object
   * @returns {Object} Sanitized user object
   */
  sanitizeUser(user) {
    const userObject = user.toObject ? user.toObject() : user;
    delete userObject.password;
    delete userObject.__v;
    return userObject;
  }

  /**
   * Get user by ID
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object (without password)
   * @throws {Error} If user not found
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.sanitizeUser(user);
  }

  /**
   * Update user profile
   * 
   * @param {string} userId - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user object
   * @throws {Error} If user not found or update fails
   */
  async updateProfile(userId, updates) {
    // Prevent updating sensitive fields
    const allowedUpdates = ['name', 'email', 'avatar', 'preferences'];
    const filteredUpdates = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // If email is being updated, check if it's already in use
    if (filteredUpdates.email) {
      const existingUser = await User.findOne({ 
        email: filteredUpdates.email.toLowerCase(),
        _id: { $ne: userId }
      });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      filteredUpdates.email = filteredUpdates.email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(
      userId,
      filteredUpdates,
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }
}

module.exports = new AuthService();
