const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  year: { type: String },
  major: { type: String },
  password: { type: String, required: true }
});

// The third argument forces the collection name to be exactly 'users'
module.exports = mongoose.model('User', UserSchema, 'users');

// module.exports = mongoose.model('User', UserSchema);