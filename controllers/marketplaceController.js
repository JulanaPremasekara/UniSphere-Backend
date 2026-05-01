const marketplaceService = require("../routes/services/marketplaceService");

class MarketplaceController {
  static async getAllItems(req, res) {
    try {
      const items = await marketplaceService.getAllItems();

      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      console.error("Controller Error fetching marketplace items:", error);
      res.status(500).json({
        success: false,
        message: "A technical error occurred while fetching marketplace items.",
      });
    }
  }

  static async getItemById(req, res) {
    try {
      const { id } = req.params;

      const item = await marketplaceService.getItemById(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Listing not found",
        });
      }

      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      console.error("Controller Error fetching marketplace item:", error);
      res.status(500).json({
        success: false,
        message: "A technical error occurred while fetching marketplace item.",
      });
    }
  }

  static async createItem(req, res) {
    try {
      const validatedData = req.body;

      const finalData = {
        ...validatedData,
        image: validatedData.image || "https://via.placeholder.com/150",
        seller: req.user.id, // Assuming req.user is populated by auth middleware
      };

      const savedItem = await marketplaceService.createItem(finalData);

      res.status(201).json({
        success: true,
        data: savedItem,
      });
    } catch (error) {
      console.error("Controller Error creating marketplace item:", error);
      res.status(400).json({
        success: false,
        message: "A technical error occurred while creating marketplace item.",
      });
    }
  }

  static async updateItem(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await marketplaceService.updateItem(id, updateData);

      if (!result.success) {
        return res.status(result.statusCode || 404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Controller Error updating marketplace item:", error);
      res.status(500).json({
        success: false,
        message: "A technical error occurred while updating marketplace item.",
      });
    }
  }

  static async deleteItem(req, res) {
    try {
      const { id } = req.params;

      const result = await marketplaceService.deleteItem(id);

      if (!result.success) {
        return res.status(result.statusCode || 404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Controller Error deleting marketplace item:", error);
      res.status(500).json({
        success: false,
        message: "A technical error occurred while deleting marketplace item.",
      });
    }
  }
}

module.exports = MarketplaceController;