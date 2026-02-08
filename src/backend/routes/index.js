/**
 * Main Routes Index
 * 
 * Aggregates and exports all API routes for the application.
 * This file serves as the central routing configuration.
 * 
 * @module routes/index
 */

const express = require('express');
const authRoutes = require('./auth');
const projectRoutes = require('./projects');

// Import additional route modules here as they are created
// const userRoutes = require('./users');
// const taskRoutes = require('./tasks');
// const iterationRoutes = require('./iterations');
// const approvalRoutes = require('./approvals');
// const decisionRoutes = require('./decisions');
// const auditRoutes = require('./audits');

const router = express.Router();

/**
 * API Health Check Endpoint
 * Useful for monitoring and load balancer health checks
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.API_VERSION || 'v1',
  });
});

/**
 * API Root Endpoint
 * Provides basic API information
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Multi-Agent SDLC Framework API',
    version: process.env.API_VERSION || 'v1',
    documentation: '/api/docs', // Add when implementing API docs
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      // Add more endpoints as they are created
    },
  });
});

/**
 * Mount Route Modules
 * All routes are prefixed with their respective paths
 */
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);

// Mount additional routes here
// router.use('/users', userRoutes);
// router.use('/tasks', taskRoutes);
// router.use('/iterations', iterationRoutes);
// router.use('/approvals', approvalRoutes);
// router.use('/decisions', decisionRoutes);
// router.use('/audits', auditRoutes);

/**
 * 404 Handler for API routes
 * Catches all undefined API endpoints
 */
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
