const AuthService = require('../routes/services/authService');
const User = require('../middleware/models/User');

class UserController {
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

  static async updateProfile(req, res) {
    try {
      const { name, year, major, password } = req.body;
      const userId = req.user.id;
      
      console.log(`>>> Attempting update for User ID: ${userId}`);

      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID not found in token" });
      }

      const updateData = { name, year, major };
      if (password) {
        updateData.password = password; // In a real app, hash this!
      }

      const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

      if (!user) {
        console.log(`>>> User with ID ${userId} not found in database.`);
        return res.status(404).json({ success: false, message: "User not found" });
      }

      console.log(`>>> User profile updated successfully for: ${user.email}`);
      return res.status(200).json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
      console.error("Update Profile Error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  static async deleteAccount(req, res) {
    try {
      const userId = req.user.id;
      console.log(`>>> Attempting deletion for User ID: ${userId}`);

      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID not found in token" });
      }

      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        console.log(`>>> User with ID ${userId} not found for deletion.`);
        return res.status(404).json({ success: false, message: "User not found" });
      }

      console.log(`>>> Account deleted successfully for ID: ${userId}`);
      return res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
      console.error("Delete Account Error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

module.exports = UserController;
