/**
 * Security Audit Routes
 * Handles security audit log endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const SecurityAudit = require('../models/SecurityAudit');

// GET /audits - Get all audit logs (admin only)
router.get('/', authenticate, async (req, res) => {
    try {
        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                error: 'Access denied. Admin privileges required.' 
            });
        }

        const { userId, action, severity } = req.query;
        const filter = {};

        if (userId) filter.userId = userId;
        if (action) filter.action = action;
        if (severity) filter.severity = severity;

        const audits = await SecurityAudit.find(filter)
            .populate('userId', 'username email')
            .sort({ timestamp: -1 })
            .limit(100); // Limit to 100 most recent logs

        res.status(200).json(audits);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch audit logs', 
            message: error.message 
        });
    }
});

// GET /audits/:id - Get audit log by ID (admin only)
router.get('/:id', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                error: 'Access denied. Admin privileges required.' 
            });
        }

        const audit = await SecurityAudit.findById(req.params.id)
            .populate('userId', 'username email');

        if (!audit) {
            return res.status(404).json({ error: 'Audit log not found' });
        }

        res.status(200).json(audit);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch audit log', 
            message: error.message 
        });
    }
});

// POST /audits - Create new audit log
router.post('/', authenticate, async (req, res) => {
    try {
        const audit = new SecurityAudit({
            ...req.body,
            userId: req.body.userId || req.user.userId,
            timestamp: new Date()
        });
        
        await audit.save();

        res.status(201).json(audit);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to create audit log', 
            message: error.message 
        });
    }
});

// GET /audits/user/:userId - Get audit logs for a specific user (admin only)
router.get('/user/:userId', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                error: 'Access denied. Admin privileges required.' 
            });
        }

        const audits = await SecurityAudit.find({ userId: req.params.userId })
            .populate('userId', 'username email')
            .sort({ timestamp: -1 })
            .limit(50);

        res.status(200).json(audits);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch user audit logs', 
            message: error.message 
        });
    }
});

module.exports = router;
