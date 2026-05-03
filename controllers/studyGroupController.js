const studyGroupService = require("../routes/services/studyGroupService");

class StudyGroupController {
  static async create(req, res) {
    try {
      const data = req.body;
      const finalData = {
        ...data,
        createdBy: req.user.id,
      };
      const session = await studyGroupService.createSession(finalData);

      return res.status(201).json({
        success: true,
        message: "Study session created successfully",
        data: session,
      });
    } catch (error) {
      console.log("CREATE ERROR:", error.message);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getAll(req, res) {
    try {
      const sessions = await studyGroupService.fetchAllSessions();

      return res.status(200).json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }

  static async getById(req, res) {
    try {
      const session = await studyGroupService.fetchSessionById(req.params.id);

      return res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async update(req, res) {
    try {
      const updatedSession = await studyGroupService.updateSession(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Study session updated successfully",
        data: updatedSession,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async join(req, res) {
    try {
      const result = await studyGroupService.joinSession(
        req.params.id,
        req.user.id,
      );

      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }

  static async leave(req, res) {
    try {
      const result = await studyGroupService.leaveSession(
        req.params.id,
        req.user.id,
      );

      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }

  static async delete(req, res) {
    try {
      const result = await studyGroupService.removeSession(req.params.id);

      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = StudyGroupController;
