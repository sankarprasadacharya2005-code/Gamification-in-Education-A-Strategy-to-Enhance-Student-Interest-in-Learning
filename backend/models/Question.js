const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Aptitude', 'Reasoning', 'Verbal'],
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        validate: [v => v.length === 4, 'Options array must contain exactly 4 items'],
        required: true
    },
    correctAnswerIndex: {
        type: Number,
        min: 0,
        max: 3,
        required: true
    },
    coinReward: {
        type: Number,
        required: true,
        default: 10
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
