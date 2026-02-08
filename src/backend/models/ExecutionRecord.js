const mongoose = require('mongoose');

const ExecutionRecordSchema = new mongoose.Schema({
    recordId: { type: mongoose.Schema.Types.ObjectId, auto: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    agentId: { type: String, required: true },
    agentType: { type: String, required: true },
    executedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: { type: String, enum: ['success', 'failure', 'pending'], required: true },
    output: { type: String },
    errorLog: { type: String },
    artifacts: [{ type: String }],
    metadata: { type: Object },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExecutionRecord', ExecutionRecordSchema);