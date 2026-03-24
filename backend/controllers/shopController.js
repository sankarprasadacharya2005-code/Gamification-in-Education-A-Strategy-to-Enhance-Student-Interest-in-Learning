const User = require('../models/User');
const StoreItem = require('../models/StoreItem');
const Redemption = require('../models/Redemption');

exports.getItems = async (req, res) => {
    try {
        const items = await StoreItem.find();
        res.json({ success: true, items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.seedItems = async (req, res) => {
    try {
        const items = [
            { name: 'EduQuest Hoodie', description: 'Premium black hoodie with EduQuest logo', costInCoins: 500, imageType: 'hoodie', stock: 100 },
            { name: 'EduQuest Backpack', description: 'Stylish and durable school bag', costInCoins: 350, imageType: 'backpack', stock: 100 },
            { name: 'EduQuest Water Bottle', description: 'Stay hydrated in style', costInCoins: 150, imageType: 'bottle', stock: 100 },
            { name: 'EduQuest Coffee Cup', description: 'Start your morning right', costInCoins: 120, imageType: 'bottle', stock: 100 },
            { name: 'EduQuest Premium Pen', description: 'Writes like a dream', costInCoins: 50, imageType: 'pen', stock: 100 },
            { name: 'EduQuest Study Diary', description: 'Organize your goals', costInCoins: 100, imageType: 'diary', stock: 100 },
        ];

        await StoreItem.deleteMany({});
        await StoreItem.insertMany(items);
        res.json({ success: true, message: 'Store seeded successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.redeemItem = async (req, res) => {
    try {
        const { itemId, studentName, studentIdString, department, phoneNumber } = req.body;
        const item = await StoreItem.findById(itemId);

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.coins < item.costInCoins) {
            return res.status(400).json({ success: false, message: 'Insufficient coins' });
        }

        if (item.stock <= 0) {
            return res.status(400).json({ success: false, message: 'Item out of stock' });
        }

        // Deduct coins and update stock
        user.coins -= item.costInCoins;
        item.stock -= 1;

        // Create redemption record with explicit form details
        await Redemption.create({
            student: user._id,
            item: item._id,
            cost: item.costInCoins,
            studentName,
            studentIdString,
            department,
            phoneNumber
        });

        // Add to coin history
        user.coinHistory.push({
            balance: user.coins,
            source: `Redeemed ${item.name}`,
            timestamp: new Date()
        });

        // Save updates
        await user.save();
        await item.save();

        res.json({
            success: true,
            message: `Successfully redeemed ${item.name}!`,
            newBalance: { coins: user.coins, xp: user.xp },
            coinHistory: user.coinHistory
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getRedemptions = async (req, res) => {
    try {
        const redemptions = await Redemption.find()
            .populate('student', 'name studentId classGrade')
            .populate('item', 'name costInCoins')
            .sort('-redeemedAt');
        res.json({ success: true, redemptions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateRedemptionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const redemption = await Redemption.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json({ success: true, redemption });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
