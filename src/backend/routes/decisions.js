/**
 * Decision Log Routes
 * Handles decision tracking endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const DecisionLog = require('../models/DecisionLog');

// GET /decisions - Get all decision logs
router.get('/', authenticate, async (req, res) => {
    try {
        const { projectId, category, madeBy } = req.query;
        const filter = {};

        if (projectId) filter.projectId = projectId;
        if (category) filter.category = category;
        if (madeBy) filter.madeBy = madeBy;

        const decisions = await DecisionLog.find(filter)
            .populate('projectId', 'name')
            .populate('madeBy', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json(decisions);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch decision logs', 
            message: error.message 
        });
    }
});

// GET /decisions/:id - Get decision log by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const decision = await DecisionLog.findById(req.params.id)
            .populate('projectId', 'name')
            .populate('madeBy', 'username email');

        if (!decision) {
            return res.status(404).json({ error: 'Decision log not found' });
        }

        res.status(200).json(decision);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch decision log', 
            message: error.message 
        });
    }
});

// POST /decisions - Create new decision log
router.post('/', authenticate, async (req, res) => {
    try {
        const decision = new DecisionLog({
            ...req.body,
            madeBy: req.user.userId
        });
        
        await decision.save();

        res.status(201).json(decision);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to create decision log', 
            message: error.message 
        });
    }
});

// PUT /decisions/:id - Update decision log
router.put('/:id', authenticate, async (req, res) => {
    try {
        const decision = await DecisionLog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('projectId', 'name')
        .populate('madeBy', 'username email');

        if (!decision) {
            return res.status(404).json({ error: 'Decision log not found' });
        }

        res.status(200).json(decision);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to update decision log', 
            message: error.message 
        });
    }
});

// DELETE /decisions/:id - Delete decision log
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const decision = await DecisionLog.findByIdAndDelete(req.params.id);

        if (!decision) {
            return res.status(404).json({ error: 'Decision log not found' });
        }

        res.status(200).json({ 
            message: 'Decision log deleted successfully',
            decisionId: req.params.id
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to delete decision log', 
            message: error.message 
        });
    }
});

module.exports = router;
