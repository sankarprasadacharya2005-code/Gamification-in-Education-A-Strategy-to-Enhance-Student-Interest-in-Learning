const express = require('express');
const router = express.Router();
const { redeemItem, getItems, seedItems, getRedemptions, updateRedemptionStatus } = require('../controllers/shopController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('student'), getItems);
router.post('/redeem', protect, authorize('student'), redeemItem);
router.post('/seed', protect, authorize('teacher'), seedItems);

// Teacher routes
router.get('/redemptions', protect, authorize('teacher'), getRedemptions);
router.patch('/redemptions/:id', protect, authorize('teacher'), updateRedemptionStatus);

module.exports = router;
