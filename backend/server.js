require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Global Mongoose Configuration
// mongoose.set('bufferCommands', false); // Removed to prevent crash when DB is disconnected

// Health Check Route
app.get('/api/health', (req, res) => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.json({
        status: states[mongoose.connection.readyState],
        dbName: mongoose.connection.name,
        timestamp: new Date()
    });
});

// Database Connection and Server Start
const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('CRITICAL: MONGODB_URI is missing!');
    process.exit(1);
}

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
})
    .then(async () => {
        console.log('✅ MongoDB connected successfully');
        await autoSeedShop();
    })
    .catch(async err => {
        console.error('❌ MongoDB Atlas connection failed. Falling back to in-memory database...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const memoryUri = mongoServer.getUri();
            await mongoose.connect(memoryUri, { serverSelectionTimeoutMS: 5000 });
            console.log('✅ In-memory MongoDB connected automatically! Your application will work but data will rest on restart.');
            await autoSeedShop();
        } catch (memErr) {
            console.error('❌ In-memory MongoDB also failed:', memErr.message);
        }
    });

async function autoSeedShop() {
    try {
        const StoreItem = require('./models/StoreItem');
        const count = await StoreItem.countDocuments();
        if (count === 0) {
            await StoreItem.insertMany([
                { name: 'EduQuest Hoodie', description: 'Premium black hoodie with EduQuest logo', costInCoins: 500, imageType: 'hoodie', stock: 100 },
                { name: 'EduQuest Backpack', description: 'Stylish and durable school bag', costInCoins: 350, imageType: 'backpack', stock: 100 },
                { name: 'EduQuest Water Bottle', description: 'Stay hydrated in style', costInCoins: 150, imageType: 'bottle', stock: 100 },
                { name: 'EduQuest Coffee Cup', description: 'Start your morning right', costInCoins: 120, imageType: 'bottle', stock: 100 },
                { name: 'EduQuest Premium Pen', description: 'Writes like a dream', costInCoins: 50, imageType: 'pen', stock: 100 },
                { name: 'EduQuest Study Diary', description: 'Organize your goals', costInCoins: 100, imageType: 'diary', stock: 100 },
            ]);
            console.log('✅ Shop items auto-seeded successfully!');
        }
    } catch (e) {
        console.error('Failed to auto-seed shop:', e.message);
    }
}

// Log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const wordGameRoutes = require('./routes/wordGameRoutes');
const shopRoutes = require('./routes/shopRoutes');
const questionRoutes = require('./routes/questionRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/wordgame', wordGameRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/questions', questionRoutes);

// --- Static Serving ---
const distPath = path.join(__dirname, '../frontend/dist');
if (require('fs').existsSync(distPath)) {
    app.use(express.static(distPath));
}

// Catch-all middleware
app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'API endpoint not found' });
    }
    const indexPath = path.join(__dirname, '../frontend/dist/index.html');
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Frontend not built. Use npm run start from root after building.');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 Application Link: http://localhost:${PORT}`);
});
