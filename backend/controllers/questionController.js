const Question = require('../models/Question');
const StudentResult = require('../models/StudentResult');
const User = require('../models/User');

// Teacher creates a new question
exports.createQuestion = async (req, res) => {
    try {
        const { category, questionText, options, correctAnswerIndex, coinReward } = req.body;
        const teacherId = req.user.id;

        const newQuestion = await Question.create({
            category,
            questionText,
            options,
            correctAnswerIndex,
            coinReward: coinReward || 10,
            author: teacherId
        });

        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            question: newQuestion
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Student fetches random questions for a test category
exports.getTestQuestions = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category && category !== 'All') {
            query.category = category;
        }

        // Fetch 10 random questions
        const questions = await Question.aggregate([
            { $match: query },
            { $sample: { size: 10 } }
        ]);

        res.json({ success: true, questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Student submits test answers
exports.submitTest = async (req, res) => {
    try {
        const { questions, answers } = req.body; // questions should be an array of Question objects
        const studentId = req.user.id;

        let correctAnswers = 0;
        let coinsEarned = 0;

        questions.forEach((q, idx) => {
            if (q.correctAnswerIndex === answers[idx]) {
                correctAnswers++;
                coinsEarned += (q.coinReward || 10);
            }
        });

        const totalQuestions = questions.length;
        const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

        // Save result
        const result = await StudentResult.create({
            studentId,
            totalQuestions,
            correctAnswers,
            scorePercentage,
            coinsEarned
        });

        // Update user coins
        const user = await User.findById(studentId);
        if (coinsEarned > 0) {
            user.coins += coinsEarned;
            user.xp += Math.floor(coinsEarned / 2);

            user.coinHistory.push({
                balance: user.coins,
                source: 'gamified_test',
                timestamp: new Date()
            });

            await user.save();
        }

        res.json({
            success: true,
            result,
            newBalance: { coins: user.coins, xp: user.xp }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Leaderboard Data
exports.getLeaderboard = async (req, res) => {
    try {
        // Fetch top students by total coins and xp
        const users = await User.find({ role: 'student' })
            .select('name coins xp badges')
            .sort({ coins: -1, xp: -1 })
            .limit(10);

        res.json({ success: true, leaderboard: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
