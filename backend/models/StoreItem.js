const mongoose = require('mongoose');

const storeItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    costInCoins: {
        type: Number,
        required: true
    },
    costInDiamonds: {
        type: Number,
        default: 0
    },
    imageType: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 100
    }
}, { timestamps: true });

module.exports = mongoose.model('StoreItem', storeItemSchema);
