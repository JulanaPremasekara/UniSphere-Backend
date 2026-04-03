const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  tags: [String],
  image: { type: String }, // URL to image
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organizerName: { type: String }, // Cached for easy display
  registrants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);