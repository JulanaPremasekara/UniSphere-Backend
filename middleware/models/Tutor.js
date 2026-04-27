const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  phone: { type: String, required: true },
  price: { type: String, required: true }, 
  bio: { type: String },
  isOnline: { type: Boolean, default: true }, 
  rating: { type: Number, default: 4.9 },
  image: { type: String },
  createdBy: { type: String, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Tutor', tutorSchema);

