const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    condition: { type: String, required: true },
    contactNumber: { type: String, required: true },
    image: { type: String },
    seller: { type: String, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Marketplace', marketplaceSchema);