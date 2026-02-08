const mongoose = require('mongoose');

// Load environment variables from .env file
require('dotenv').config();

// MongoDB connection string from environment variables
const connectionString = process.env.MONGODB_URI;

// Connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose.connect(connectionString, options)
    .then(() => {
        console.log('MongoDB connection successful');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Export mongoose instance for use in the application
module.exports = mongoose;