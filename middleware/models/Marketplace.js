const mongoose = require('mongoose');

const MarketplaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  condition: { type: String, required: true },
  image: { type: String, default: "https://via.placeholder.com/150" },
  seller: {
    name: { type: String, default: "UniSphere User" },
    image: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Marketplace', MarketplaceSchema);