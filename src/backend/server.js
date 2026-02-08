/**
 * Multi-Agent SDLC Framework - Backend Server
 * Main Express application entry point
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import configurations
const environment = require('./config/environment');
const securityConfig = require('./config/security');
require('./config/database');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import routes
const apiRoutes = require('./routes/index');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet(securityConfig.helmet));
app.use(cors(securityConfig.cors));

// Logging middleware
if (!environment.isTest()) {
    app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Multi-Agent SDLC Framework API',
        version: '1.0.0',
        status: 'running',
        environment: environment.nodeEnv,
        documentation: '/api'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.path}`,
        availableEndpoints: '/api'
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server
const PORT = environment.server.port;
const HOST = environment.server.host;

app.listen(PORT, HOST, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║   Multi-Agent SDLC Framework - Backend Server Started    ║
╠═══════════════════════════════════════════════════════════╣
║   Environment: ${environment.nodeEnv.padEnd(43)} ║
║   Server:      http://${HOST}:${PORT}${' '.repeat(26)} ║
║   API:         http://${HOST}:${PORT}/api${' '.repeat(22)} ║
╚═══════════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    app.close(() => {
        console.log('HTTP server closed');
    });
});

module.exports = app;