const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  year: { type: String },
  major: { type: String },
  password: { type: String, required: true }
});

UserSchema.pre('save', async function () {
  if (this.isNew && !this._id) {
    const lastUser = await this.constructor.findOne({ _id: /^ST\d+$/ }).sort({ _id: -1 }).collation({ locale: 'en_US', numericOrdering: true });
    const num = lastUser ? parseInt(lastUser._id.replace('ST', ''), 10) : NaN;
    this._id = !isNaN(num) ? `ST${num + 1}` : 'ST1001';
  }
  if (this.isModified('password')) this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
});

// The third argument forces the collection name to be exactly 'users'
module.exports = mongoose.model('User', UserSchema, 'users');