'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRATION = '1h';
const REFRESH_TOKEN_EXPIRATION = '7d';

// Signup function to create new users with hashed passwords
async function signup(req, res) {
    const { username, password } = req.body;
    try {
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

// Login function that validates credentials and returns JWT tokens
async function login(req, res) {
    const { username, password } = req.body;
    try {
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password with hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

// Token refresh function
async function refresh(req, res) {
    const { token } = req.body;
    try {
        if (!token) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        // Verify token
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token' });

            // Generate new token
            const newToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
            res.json({ token: newToken });
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

// Logout function
function logout(req, res) {
    // Implement logout logic if needed (e.g., token blacklisting)
    res.status(200).json({ message: 'Logged out successfully' });
}

module.exports = { signup, login, refresh, logout };