const express = require('express');
const router = express.Router();
const { createQuestion, getTestQuestions, submitTest, getLeaderboard } = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create', protect, authorize('teacher'), createQuestion);
router.get('/test', protect, authorize('student'), getTestQuestions);
router.post('/submit', protect, authorize('student'), submitTest);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
