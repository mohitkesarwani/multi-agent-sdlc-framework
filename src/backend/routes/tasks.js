/**
 * Task Routes
 * Handles task management endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Task = require('../models/Task');

// GET /tasks - Get all tasks
router.get('/', authenticate, async (req, res) => {
    try {
        const { projectId, status, assignedTo } = req.query;
        const filter = {};

        if (projectId) filter.projectId = projectId;
        if (status) filter.status = status;
        if (assignedTo) filter.assignedTo = assignedTo;

        const tasks = await Task.find(filter)
            .populate('projectId', 'name')
            .populate('assignedTo', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch tasks', 
            message: error.message 
        });
    }
});

// GET /tasks/:id - Get task by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('projectId', 'name')
            .populate('assignedTo', 'username email');

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch task', 
            message: error.message 
        });
    }
});

// POST /tasks - Create new task
router.post('/', authenticate, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            createdBy: req.user.userId
        });
        
        await task.save();

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to create task', 
            message: error.message 
        });
    }
});

// PUT /tasks/:id - Update task
router.put('/:id', authenticate, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('projectId', 'name')
        .populate('assignedTo', 'username email');

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to update task', 
            message: error.message 
        });
    }
});

// DELETE /tasks/:id - Delete task
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ 
            message: 'Task deleted successfully',
            taskId: req.params.id
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to delete task', 
            message: error.message 
        });
    }
});

module.exports = router;
