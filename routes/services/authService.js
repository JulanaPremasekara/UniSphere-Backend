const jwt = require('jsonwebtoken');
const User = require('../../middleware/models/User');

class AuthService {
  static async login(email, password) {
    try {
      // 1. Find the user
      const user = await User.findOne({ email });

      // 2. Check if user exists and password matches
      if (!user || user.password !== password) {
        return { success: false, message: 'Invalid email or password' };
      }

      // 3. Generate token
      const token = this.generateAccessToken(user);

      return {
        success: true,
        token: token,
        user: { email: user.email, name: user.name }
      };
    } catch (error) {
      console.error('AuthService Login Technical Error:', error);
      return { success: false, message: 'Server error during authentication' };
    }
  }

  static async signup(userData) {
    try {
      // 1. Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return { success: false, message: 'User already exists' };
      }

      // 2. Create new user
      const newUser = new User(userData);
      await newUser.save();

      return { success: true, message: 'User created successfully' };
    } catch (error) {
      console.error('AuthService Signup Error:', error);
      return { success: false, message: 'Signup failed. Please try again.' };
    }
  }

  static generateAccessToken(user) {
    const secret = process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key_123';
    return jwt.sign(
      { id: user.id || user._id, email: user.email, name: user.name },
      secret,
      { expiresIn: '15m' }
    );
  }
}

module.exports = AuthService;