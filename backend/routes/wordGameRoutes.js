const express = require('express');
const router = express.Router();
const { getRandomWord, verifyGuess } = require('../controllers/wordGameController');
const { protect } = require('../middleware/authMiddleware');

router.get('/random', protect, getRandomWord);
router.post('/verify', protect, verifyGuess);

module.exports = router;
