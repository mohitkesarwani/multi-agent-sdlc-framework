/**
 * Authentication Routes
 * Handles user authentication endpoints
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const AuthService = require('../services/AuthService');
const { authenticate } = require('../middleware/auth');

// POST /signup - User Registration
router.post('/signup', [
    body('username').isString().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isIn(['user', 'admin', 'developer']).withMessage('Invalid role')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await AuthService.register(req.body);
        
        res.status(201).json({ 
            message: 'User registered successfully',
            user 
        });
    } catch (error) {
        res.status(400).json({ 
            error: 'Registration failed', 
            message: error.message 
        });
    }
});

// POST /login - User Authentication
router.post('/login', [
    body('username').isString().notEmpty().withMessage('Username or email is required'),
    body('password').isString().notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        const result = await AuthService.login(username, password);
        
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ 
            error: 'Authentication failed', 
            message: error.message 
        });
    }
});

// POST /refresh - Token Refresh
router.post('/refresh', [
    body('refreshToken').isString().notEmpty().withMessage('Refresh token is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { refreshToken } = req.body;
        const result = await AuthService.refreshToken(refreshToken);
        
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ 
            error: 'Token refresh failed', 
            message: error.message 
        });
    }
});

// POST /logout - Logout
router.post('/logout', authenticate, async (req, res) => {
    try {
        await AuthService.logout(req.user.userId);
        
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ 
            error: 'Logout failed', 
            message: error.message 
        });
    }
});

// POST /change-password - Change Password
router.post('/change-password', authenticate, [
    body('oldPassword').isString().notEmpty().withMessage('Current password is required'),
    body('newPassword').isString().isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { oldPassword, newPassword } = req.body;
        await AuthService.changePassword(req.user.userId, oldPassword, newPassword);
        
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(400).json({ 
            error: 'Password change failed', 
            message: error.message 
        });
    }
});

// GET /me - Get current user info
router.get('/me', authenticate, (req, res) => {
    res.status(200).json({ user: req.user });
});

module.exports = router;