const mongoose = require('mongoose');

const HousingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  roomType: {
    type: String,
    enum: ['Single', 'Shared', 'Apartment'],
    default: 'Single'
  },
  rentPrice: {
    type: Number,
    required: [true, 'Rent price is required']
  },
  deposit: {
    type: Number
  },
  availableFrom: {
    type: Date
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'Not Available'],
    default: 'Available'
  },
  furnished: {
    type: Boolean,
    default: false
  },
  wifi: {
    type: Boolean,
    default: false
  },
  parking: {
    type: Boolean,
    default: false
  },
  images: {
    type: [String], // Array of base64 strings
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  contactName: {
    type: String,
    required: [true, 'Contact name is required']
  },
  contactPhone: {
    type: String
  },
  contactEmail: {
    type: String
  },
  postedBy: {
    type: String, // Matching the String ID used in User model (ST1001, etc.)
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure that at least one contact method is provided
HousingSchema.pre('validate', function(next) {
  if (!this.contactPhone && !this.contactEmail) {
    this.invalidate('contactPhone', 'At least one contact method (phone or email) is required');
    this.invalidate('contactEmail', 'At least one contact method (phone or email) is required');
  }
  next();
});

module.exports = mongoose.model('Housing', HousingSchema);
