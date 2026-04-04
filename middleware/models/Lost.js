const mongoose = require('mongoose');

const LostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    features: { type: String, required: true },
    status: { type: String, enum: ['lost', 'found'], required: true },
    image: { type: String }, // URL to image
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Lost', LostSchema);