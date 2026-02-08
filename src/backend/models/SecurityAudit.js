const mongoose = require('mongoose');

const SecurityAuditSchema = new mongoose.Schema({
    auditId: { type: mongoose.Schema.Types.ObjectId, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    affectedComponent: { type: String, required: true },
    foundBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['open', 'in-progress', 'resolved', 'ignored'], required: true },
    resolution: { type: String },
    resolutionDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SecurityAudit', SecurityAuditSchema);