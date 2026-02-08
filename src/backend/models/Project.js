const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
        index: true,
    },
    description: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {
        type: String,
        enum: ['planning', 'active', 'completed', 'archived'],
        required: true,
        index: true,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Creating indexes
ProjectSchema.index({ name: 1 });
ProjectSchema.index({ status: 1 });

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;