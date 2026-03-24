require('dotenv').config();
const mongoose = require('mongoose');
const StoreItem = require('./models/StoreItem');

const items = [
    { name: 'Black Hoodie', description: 'Premium black hoodie', costInCoins: 500, imageType: 'hoodie', stock: 100 },
    { name: 'Black Backpack', description: 'Stylish and durable school bag', costInCoins: 350, imageType: 'backpack', stock: 100 },
    { name: 'Black Premium Pen', description: 'Writes like a dream', costInCoins: 50, imageType: 'pen', stock: 100 },
    { name: 'Black Coffee Cup', description: 'Start your morning right', costInCoins: 120, imageType: 'bottle', stock: 100 },
    { name: 'Black Water Bottle', description: 'Stay hydrated in style', costInCoins: 150, imageType: 'bottle', stock: 100 },
    { name: 'Black Study Diary', description: 'Organize your goals', costInCoins: 100, imageType: 'diary', stock: 100 },
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        await StoreItem.deleteMany({});
        await StoreItem.insertMany(items);
        console.log('Shop items seeded successfully');
        process.exit();
    })
    .catch(err => {
        console.error('Error connecting to database', err);
        process.exit(1);
    });
