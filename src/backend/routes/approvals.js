/**
 * Approval Routes
 * Handles approval workflow endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Approval = require('../models/Approval');

// GET /approvals - Get all approvals
router.get('/', authenticate, async (req, res) => {
    try {
        const { status, requestedBy, reviewedBy } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (requestedBy) filter.requestedBy = requestedBy;
        if (reviewedBy) filter.reviewedBy = reviewedBy;

        const approvals = await Approval.find(filter)
            .populate('requestedBy', 'username email')
            .populate('reviewedBy', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json(approvals);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch approvals', 
            message: error.message 
        });
    }
});

// GET /approvals/:id - Get approval by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const approval = await Approval.findById(req.params.id)
            .populate('requestedBy', 'username email')
            .populate('reviewedBy', 'username email');

        if (!approval) {
            return res.status(404).json({ error: 'Approval not found' });
        }

        res.status(200).json(approval);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch approval', 
            message: error.message 
        });
    }
});

// POST /approvals - Create new approval request
router.post('/', authenticate, async (req, res) => {
    try {
        const approval = new Approval({
            ...req.body,
            requestedBy: req.user.userId,
            status: 'pending'
        });
        
        await approval.save();

        res.status(201).json(approval);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to create approval request', 
            message: error.message 
        });
    }
});

// PUT /approvals/:id/approve - Approve request
router.put('/:id/approve', authenticate, async (req, res) => {
    try {
        const approval = await Approval.findByIdAndUpdate(
            req.params.id,
            {
                status: 'approved',
                reviewedBy: req.user.userId,
                reviewedAt: new Date(),
                comments: req.body.comments
            },
            { new: true }
        ).populate('requestedBy', 'username email')
        .populate('reviewedBy', 'username email');

        if (!approval) {
            return res.status(404).json({ error: 'Approval not found' });
        }

        res.status(200).json(approval);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to approve request', 
            message: error.message 
        });
    }
});

// PUT /approvals/:id/reject - Reject request
router.put('/:id/reject', authenticate, async (req, res) => {
    try {
        const approval = await Approval.findByIdAndUpdate(
            req.params.id,
            {
                status: 'rejected',
                reviewedBy: req.user.userId,
                reviewedAt: new Date(),
                comments: req.body.comments
            },
            { new: true }
        ).populate('requestedBy', 'username email')
        .populate('reviewedBy', 'username email');

        if (!approval) {
            return res.status(404).json({ error: 'Approval not found' });
        }

        res.status(200).json(approval);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to reject request', 
            message: error.message 
        });
    }
});

// DELETE /approvals/:id - Delete approval
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const approval = await Approval.findByIdAndDelete(req.params.id);

        if (!approval) {
            return res.status(404).json({ error: 'Approval not found' });
        }

        res.status(200).json({ 
            message: 'Approval deleted successfully',
            approvalId: req.params.id
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to delete approval', 
            message: error.message 
        });
    }
});

module.exports = router;
