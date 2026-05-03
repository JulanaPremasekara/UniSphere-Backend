const AuthService = require('../routes/services/authService');
const User = require('../middleware/models/User');
const Event = require('../middleware/models/Event');
const StudyGroup = require('../middleware/models/StudyGroup');
const { deleteFromCloud } = require('../middleware/supabaseUpload');

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
      const user = await User.findById(req.user.id).select('-password').lean();
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const eventCount = await Event.countDocuments({ registrants: req.user.id });
      const groupCount = await StudyGroup.countDocuments({ 
        $or: [
          { joinedUsers: req.user.id }, 
          { createdBy: req.user.id }
        ] 
      });

      res.status(200).json({ 
        success: true, 
        user: { 
          ...user, 
          eventCount, 
          groupCount 
        } 
      });
    } catch (e) { res.status(500).json({ success: false, message: "Server error" }); }
  }

  static async updateProfile(req, res) {
    try {
      if (!req.user.id) return res.status(400).json({ success: false, message: "User ID not found in token" });
      const { name, phone, year, major, password, image } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (year) user.year = year;
      if (major) user.major = major;
      if (password) user.password = password;
      if (image) {
        if (user.image) {
          await deleteFromCloud('Images', user.image);
        }
        user.image = image;
      }

      await user.save();
      const updatedUser = await User.findById(req.user.id).select('-password');
      res.status(200).json({ success: true, message: "Profile updated", user: updatedUser });
    } catch (e) { res.status(500).json({ success: false, message: "Server error" }); }
  }

  static async deleteProfileImage(req, res) {
    try {
      if (!req.user.id) return res.status(400).json({ success: false, message: "User ID not found" });
      const user = await User.findById(req.user.id);
      if (user && user.image) {
        await deleteFromCloud('Images', user.image);
        user.image = undefined;
        await user.save();
      }
      const updatedUser = await User.findById(req.user.id).select('-password');
      res.status(200).json({ success: true, message: "Profile image deleted", user: updatedUser });
    } catch (e) { res.status(500).json({ success: false, message: "Server error" }); }
  }

  static async deleteAccount(req, res) {
    try {
      if (!req.user.id) return res.status(400).json({ success: false, message: "User ID not found in token" });
      const user = await User.findByIdAndDelete(req.user.id);
      user ? res.status(200).json({ success: true, message: "Account deleted" }) : res.status(404).json({ success: false, message: "User not found" });
    } catch (e) { res.status(500).json({ success: false, message: "Server error" }); }
  }

  static async getUserbyID(req, res) {
    try {
      const user = await User.findById(req.params.id).select('-password').lean();
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const eventCount = await Event.countDocuments({ registrants: req.params.id });
      const groupCount = await StudyGroup.countDocuments({ 
        $or: [
          { joinedUsers: req.params.id }, 
          { createdBy: req.params.id }
        ] 
      });

      res.status(200).json({ 
        success: true, 
        user: { 
          ...user, 
          eventCount, 
          groupCount 
        } 
      });
    } catch (e) { res.status(500).json({ success: false, message: "Server error" }); }
  }
}

module.exports = UserController;
