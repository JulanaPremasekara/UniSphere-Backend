const AuthService = require('../routes/services/authService');
const User = require('../middleware/models/User');

class UserController {
  /**
   * Handle user login
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Business Logic handled by AuthService
      const result = await AuthService.login(email, password);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(401).json(result);
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Handle user signup
   */
  static async signup(req, res) {
    try {
      const { name, email, year, major, password } = req.body;
      
      // Basic validation
      if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      // Business Logic handled by AuthService
      const result = await AuthService.signup({ name, email, year, major, password });

      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  // Add this method to handle the profile request
  static async getProfile(req, res) {
    try {
      // req.user comes from the authenticateToken middleware
      const user = await User.findById(req.user.id).select('-password');
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

module.exports = UserController;
