// projectController.js

const Project = require('../models/Project'); // Assume you have a Project model defined
const User = require('../models/User'); // Assume you have a User model defined

// Middleware for authorization
const authorize = require('../middleware/authorize');

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json({ message: 'Project created successfully', project });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json({ message: 'Project updated successfully', project });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a team member to a project
exports.addTeamMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        project.teamMembers.push(req.body.memberId);
        await project.save();
        res.status(200).json({ message: 'Team member added successfully', project });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Remove a team member from a project
exports.removeTeamMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        project.teamMembers.pull(req.body.memberId);
        await project.save();
        res.status(200).json({ message: 'Team member removed successfully', project });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Export the controller functions
module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
};