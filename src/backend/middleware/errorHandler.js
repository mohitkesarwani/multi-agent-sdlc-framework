// Error Handling Middleware

const errorHandler = (err, req, res, next) => {
    // Log error to console
    console.error(err);

    // Standardized error response format
    const statusCode = res.statusCode ? res.statusCode : 500; // Default to 500 if not set
    res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: err.message,
        // Optional: include the stack trace in development mode only
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

// Export the error handler middleware
module.exports = errorHandler;