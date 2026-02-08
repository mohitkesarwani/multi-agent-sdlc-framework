const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const approvalSchema = new Schema({
    approvalId: { type: Schema.Types.ObjectId, auto: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reason: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date }
});

module.exports = mongoose.model('Approval', approvalSchema);