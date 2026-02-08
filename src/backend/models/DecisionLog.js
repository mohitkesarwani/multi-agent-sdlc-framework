const mongoose = require('mongoose');

const DecisionLogSchema = new mongoose.Schema({
    decisionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    iterationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Iteration', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    madeBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    context: { type: String },
    impact: { type: String },
    alternatives: { type: [String] },
    decision: { type: String, required: true },
    rationale: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    closedAt: { type: Date }
});

module.exports = mongoose.model('DecisionLog', DecisionLogSchema);
