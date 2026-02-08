/**
 * User Routes
 * Handles user management endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

// GET /users - Get all users (admin only)
router.get('/', authenticate, async (req, res) => {
    try {
        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                error: 'Access denied. Admin privileges required.' 
            });
        }

        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch users', 
            message: error.message 
        });
    }
});

// GET /users/:id - Get user by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        // Users can only view their own profile unless they're admin
        if (req.user.userId !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ 
                error: 'Access denied. You can only view your own profile.' 
            });
        }

        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch user', 
            message: error.message 
        });
    }
});

// PUT /users/:id - Update user
router.put('/:id', authenticate, async (req, res) => {
    try {
        // Users can only update their own profile unless they're admin
        if (req.user.userId !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ 
                error: 'Access denied. You can only update your own profile.' 
            });
        }

        const { username, email, role } = req.body;
        const updateData = {};

        if (username) updateData.username = username;
        if (email) updateData.email = email;
        
        // Only admins can update roles
        if (role && req.user.role === 'admin') {
            updateData.role = role;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to update user', 
            message: error.message 
        });
    }
});

// DELETE /users/:id - Delete user (admin only)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                error: 'Access denied. Admin privileges required.' 
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ 
            message: 'User deleted successfully',
            userId: req.params.id
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to delete user', 
            message: error.message 
        });
    }
});

module.exports = router;
