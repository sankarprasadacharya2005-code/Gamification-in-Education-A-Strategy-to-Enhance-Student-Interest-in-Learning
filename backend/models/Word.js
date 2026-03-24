const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        uppercase: true
    },
    hint: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'General'
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    }
}, { timestamps: true });

module.exports = mongoose.model('Word', wordSchema);
