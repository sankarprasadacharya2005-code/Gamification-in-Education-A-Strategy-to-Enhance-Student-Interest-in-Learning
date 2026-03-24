const mongoose = require('mongoose');

const studentResultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    scorePercentage: {
        type: Number,
        required: true
    },
    coinsEarned: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('StudentResult', studentResultSchema);
