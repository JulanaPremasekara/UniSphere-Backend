const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    condition: { type: String, required: true },
    contactNumber: { type: String, required: true }, // <--- ADD THIS LINE
    image: { type: String },
    seller: {
        name: { type: String, default: "UniSphere User" }
    }
}, { timestamps: true });

module.exports = mongoose.model('Marketplace', marketplaceSchema);