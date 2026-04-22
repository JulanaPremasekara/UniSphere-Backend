const jwt = require('jsonwebtoken');
const User = require('../../middleware/models/User');
const bcrypt = require('bcryptjs');

class AuthService {
  static async login(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.password)) return { success: false, message: 'Invalid email or password' };
      return { success: true, token: this.generateAccessToken(user), user: { email: user.email, name: user.name } };
    } catch (error) {
      return { success: false, message: 'Server error during authentication' };
    }
  }

  static async signup(userData) {
    try {
      if (await User.findOne({ email: userData.email })) return { success: false, message: 'User already exists' };
      await new User(userData).save();
      return { success: true, message: 'User created successfully' };
    } catch (error) {
      return { success: false, message: 'Signup failed. Please try again.' };
    }
  }

  static generateAccessToken(user) {
    return jwt.sign({ id: user.id || user._id, email: user.email, name: user.name }, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key_123', { expiresIn: '15m' });
  }
}

module.exports = AuthService;