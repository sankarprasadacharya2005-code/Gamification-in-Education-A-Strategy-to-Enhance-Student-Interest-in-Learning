const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    questions: [{
        questionText: String,
        options: [String],
        correctAnswerIndex: Number,
        points: { type: Number, default: 10 }
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
