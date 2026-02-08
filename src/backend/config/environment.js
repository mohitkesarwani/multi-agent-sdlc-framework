/**
 * Environment Configuration
 * Centralizes all environment variables and application settings
 */

require('dotenv').config();

const environment = {
    // Node Environment
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Server Configuration
    server: {
        port: parseInt(process.env.API_PORT || '5000', 10),
        host: process.env.API_HOST || 'localhost',
        apiVersion: 'v1'
    },

    // Database Configuration
    database: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/sdlc_db',
        name: process.env.MONGO_DB_NAME || 'sdlc_db',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    // Frontend Configuration
    frontend: {
        url: process.env.VITE_API_BASE_URL || 'http://localhost:5173'
    },

    // Agent Orchestrator Settings
    agent: {
        logLevel: process.env.AGENT_LOG_LEVEL || 'info',
        timeoutMs: parseInt(process.env.AGENT_TIMEOUT_MS || '30000', 10),
        humanApprovalTimeoutMs: parseInt(process.env.HUMAN_APPROVAL_TIMEOUT_MS || '3600000', 10)
    },

    // Logging Configuration
    logging: {
        format: process.env.LOG_FORMAT || 'json',
        directory: process.env.LOG_DIR || './logs',
        level: process.env.AGENT_LOG_LEVEL || 'info'
    },

    // Third-party Services (Optional)
    services: {
        slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || null,
        githubToken: process.env.GITHUB_TOKEN || null
    },

    // Helper functions
    isDevelopment: () => environment.nodeEnv === 'development',
    isProduction: () => environment.nodeEnv === 'production',
    isTest: () => environment.nodeEnv === 'test'
};

module.exports = environment;
