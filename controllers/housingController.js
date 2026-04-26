const housingService = require("../routes/services/housingService");

class HousingController {
  static async createHousing(req, res) {
    try {
      const validatedData = req.body;

      const finalData = {
        ...validatedData,
        postedBy: req.user.id,
      };

      const savedHousing = await housingService.createHousing(finalData);

      res.status(201).json({
        success: true,
        message: "Housing post created successfully",
        data: savedHousing,
      });
    } catch (error) {
      console.error("Controller Error creating housing:", error);
      res.status(500).json({
        success: false,
        message: "A technical error occurred while creating housing post.",
      });
    }
  }

  static async getAllHousing(req, res) {
    try {
      const { search, location } = req.query;

      const housings = await housingService.getAllHousing(search, location);

      res.status(200).json({
        success: true,
        data: housings,
      });
    } catch (error) {
      console.error("Controller Error fetching housing:", error);
      res.status(500).json({
        success: false,
        message: "A technical error occurred while fetching housing posts.",
      });
    }
  }

  static async getHousingById(req, res) {
    try {
      const { id } = req.params;

      const housing = await housingService.getHousingById(id);

      if (!housing) {
        return res.status(404).json({
          success: false,
          message: "Housing post not found",
        });
      }

      res.status(200).json({
        success: true,
        data: housing,
      });
    } catch (error) {
      console.error("Controller Error fetching housing by ID:", error);
      res.status(500).json({
        success: false,
        message: "A technical error occurred while fetching housing post.",
      });
    }
  }

  static async updateHousing(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;

      const result = await housingService.updateHousing(id, updateData, userId);

      if (!result.success) {
        return res.status(result.statusCode || 404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Controller Error updating housing:", error);
      res.status(500).json({
        success: false,
        message: "A technical error occurred while updating housing post.",
      });
    }
  }

  static async deleteHousing(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await housingService.deleteHousing(id, userId);

      if (!result.success) {
        return res.status(result.statusCode || 404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Controller Error deleting housing:", error);
      res.status(500).json({
        success: false,
        message: "A technical error occurred while deleting housing post.",
      });
    }
  }
}

module.exports = HousingController;