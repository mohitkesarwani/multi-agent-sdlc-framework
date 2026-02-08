/**
 * Iteration Routes
 * Handles iteration management endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Iteration = require('../models/Iteration');

// GET /iterations - Get all iterations
router.get('/', authenticate, async (req, res) => {
    try {
        const { projectId, status } = req.query;
        const filter = {};

        if (projectId) filter.projectId = projectId;
        if (status) filter.status = status;

        const iterations = await Iteration.find(filter)
            .populate('projectId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(iterations);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch iterations', 
            message: error.message 
        });
    }
});

// GET /iterations/:id - Get iteration by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const iteration = await Iteration.findById(req.params.id)
            .populate('projectId', 'name');

        if (!iteration) {
            return res.status(404).json({ error: 'Iteration not found' });
        }

        res.status(200).json(iteration);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch iteration', 
            message: error.message 
        });
    }
});

// POST /iterations - Create new iteration
router.post('/', authenticate, async (req, res) => {
    try {
        const iteration = new Iteration(req.body);
        await iteration.save();

        res.status(201).json(iteration);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to create iteration', 
            message: error.message 
        });
    }
});

// PUT /iterations/:id - Update iteration
router.put('/:id', authenticate, async (req, res) => {
    try {
        const iteration = await Iteration.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!iteration) {
            return res.status(404).json({ error: 'Iteration not found' });
        }

        res.status(200).json(iteration);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to update iteration', 
            message: error.message 
        });
    }
});

// DELETE /iterations/:id - Delete iteration
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const iteration = await Iteration.findByIdAndDelete(req.params.id);

        if (!iteration) {
            return res.status(404).json({ error: 'Iteration not found' });
        }

        res.status(200).json({ 
            message: 'Iteration deleted successfully',
            iterationId: req.params.id
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to delete iteration', 
            message: error.message 
        });
    }
});

module.exports = router;
