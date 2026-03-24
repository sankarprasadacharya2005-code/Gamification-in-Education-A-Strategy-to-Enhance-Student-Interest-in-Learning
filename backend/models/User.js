const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['student', 'teacher'],
        required: true
    },
    studentId: {
        type: String,
        unique: true,
        sparse: true
    },
    teacherId: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    coins: {
        type: Number,
        default: 0
    },
    xp: {
        type: Number,
        default: 0
    },
    badges: [{
        type: String
    }],
    diamonds: {
        type: Number,
        default: 0
    },
    currentLevel: {
        type: Number,
        default: 1
    },
    unlockedLevels: {
        type: [Number],
        default: [1]
    },
    classGrade: {
        type: String
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    quizHistory: [{
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
        score: Number,
        totalPoints: Number,
        completedAt: { type: Date, default: Date.now }
    }],
    isApproved: {
        type: Boolean,
        default: true
    },
    coinHistory: [{
        balance: { type: Number, required: true },
        source: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
