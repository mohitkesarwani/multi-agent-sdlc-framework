const mongoose = require('mongoose');

const IterationSchema = new mongoose.Schema({
    iterationId: { type: mongoose.Schema.Types.ObjectId, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    iterationNumber: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { 
        type: String,
        enum: ['planning', 'in-progress', 'completed', 'cancelled'],
        required: true,
    },
    goals: { type: [String] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

IterationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Iteration = mongoose.model('Iteration', IterationSchema);
module.exports = Iteration;