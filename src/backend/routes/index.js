/**
 * Main Routes Index
 * Consolidates all application routes
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const projectRoutes = require('./projects');
const iterationRoutes = require('./iterations');
const taskRoutes = require('./tasks');
const approvalRoutes = require('./approvals');
const decisionRoutes = require('./decisions');
const auditRoutes = require('./audits');

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'Multi-Agent SDLC Framework API'
    });
});

// API version info
router.get('/', (req, res) => {
    res.status(200).json({
        name: 'Multi-Agent SDLC Framework API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            projects: '/api/projects',
            iterations: '/api/iterations',
            tasks: '/api/tasks',
            approvals: '/api/approvals',
            decisions: '/api/decisions',
            audits: '/api/audits'
        }
    });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/iterations', iterationRoutes);
router.use('/tasks', taskRoutes);
router.use('/approvals', approvalRoutes);
router.use('/decisions', decisionRoutes);
router.use('/audits', auditRoutes);

module.exports = router;
