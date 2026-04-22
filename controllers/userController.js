const AuthService = require('../routes/services/authService');
const User = require('../middleware/models/User');

class UserController {
  static async login(req, res) {
    try {
      const result = await AuthService.login(req.body.email, req.body.password);
      res.status(result.success ? 200 : 401).json(result);
    } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  static async signup(req, res) {
    try {
      const { name, email, phone, year, major, password } = req.body;
      if (!email || !password || !name) return res.status(400).json({ success: false, message: 'Missing required fields' });
      const result = await AuthService.signup({ name, email, phone, year, major, password });
      res.status(result.success ? 201 : 400).json(result);
    } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      user ? res.status(200).json({ success: true, user }) : res.status(404).json({ success: false, message: "User not found" });
    } catch (e) { res.status(500).json({ success: false, message: "Server error" }); }
  }

  static async updateProfile(req, res) {
    try {
      if (!req.user.id) return res.status(400).json({ success: false, message: "User ID not found in token" });
      const { name, phone, year, major, password } = req.body;
      const updateData = password ? { name,phone, year, major, password } : { name,phone, year, major };
      const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
      user ? res.status(200).json({ success: true, message: "Profile updated", user }) : res.status(404).json({ success: false, message: "User not found" });
    } catch (e) { res.status(500).json({ success: false, message: "Server error" }); }
  }

  static async deleteAccount(req, res) {
    try {
      if (!req.user.id) return res.status(400).json({ success: false, message: "User ID not found in token" });
      const user = await User.findByIdAndDelete(req.user.id);
      user ? res.status(200).json({ success: true, message: "Account deleted" }) : res.status(404).json({ success: false, message: "User not found" });
    } catch (e) { res.status(500).json({ success: false, message: "Server error" }); }
  }
}

module.exports = UserController;
