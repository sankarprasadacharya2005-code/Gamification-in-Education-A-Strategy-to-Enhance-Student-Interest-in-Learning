const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoreItem',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'delivered', 'collected', 'cancelled'],
        default: 'pending'
    },
    studentName: { type: String },
    studentIdString: { type: String },
    department: { type: String },
    phoneNumber: { type: String },
    paymentMethod: {
        type: String,
        enum: ['coin', 'diamond'],
        default: 'coin'
    },
    redeemedAt: {
        type: Date,
        default: Date.now
    },
    cost: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Redemption', redemptionSchema);
