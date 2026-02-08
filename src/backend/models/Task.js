const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, auto: true },
    iterationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Iteration' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
    status: { type: String, enum: ['todo', 'in-progress', 'review', 'completed'], required: true },
    dueDate: { type: Date },
    estimatedHours: { type: Number },
    completedHours: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);