const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  _id: { type: String },
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  tags: [String],
  image: { type: String }, // URL to image
  organizer: { type: String, ref: 'User', required: true },
  organizerName: { type: String }, // Cached for easy display
  registrants: [{ type: String, ref: 'User' }],
}, { timestamps: true });

EventSchema.pre('save', async function () {
  if (this.isNew && !this._id) {
    const lastEvent = await this.constructor.findOne().sort({ _id: -1 }).collation({ locale: 'en_US', numericOrdering: true });
    const num = lastEvent ? parseInt(lastEvent._id.replace('EV', ''), 10) : NaN;
    this._id = !isNaN(num) ? `EV${num + 1}` : 'EV1001';
  }
});

module.exports = mongoose.model('Event', EventSchema);