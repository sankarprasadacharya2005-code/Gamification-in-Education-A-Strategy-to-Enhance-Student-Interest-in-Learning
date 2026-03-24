const express = require('express');
const router = express.Router();
const { createQuiz, getTeacherQuizzes, getAvailableQuizzes, submitQuiz } = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Check if authMiddleware exists, if not I will create it
router.post('/create', protect, authorize('teacher'), createQuiz);
router.get('/teacher', protect, authorize('teacher'), getTeacherQuizzes);
router.get('/available', protect, authorize('student'), getAvailableQuizzes);
router.post('/submit', protect, authorize('student'), submitQuiz);

module.exports = router;
