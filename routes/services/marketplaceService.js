const Marketplace = require("../../middleware/models/Marketplace");
const { deleteFromCloud } = require("../../middleware/supabaseUpload");

class MarketplaceService {
  async getAllItems() {
    return await Marketplace.find().sort({ createdAt: -1 }).lean();
  }

  async getItemById(id) {
    return await Marketplace.findById(id).lean();
  }

  async createItem(itemData) {
    const newItem = new Marketplace(itemData);
    return await newItem.save();
  }

  async updateItem(id, updateData) {
    const oldItem = await Marketplace.findById(id);

    if (!oldItem) {
      return {
        success: false,
        statusCode: 404,
        message: "Listing not found.",
      };
    }

    const oldImageUrl = oldItem.image;
    const newImageUrl = updateData.image;

    const updatedItem = await Marketplace.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (newImageUrl && oldImageUrl && newImageUrl !== oldImageUrl) {
      const cleanup = await deleteFromCloud("Images", oldImageUrl);

      if (!cleanup.success) {
        console.warn(`Old marketplace image cleanup failed: ${cleanup.message}`);
      }
    }

    return {
      success: true,
      data: updatedItem,
      message: "Marketplace item updated successfully.",
    };
  }

  async deleteItem(id) {
    const deletedItem = await Marketplace.findByIdAndDelete(id);

    if (!deletedItem) {
      return {
        success: false,
        statusCode: 404,
        message: "Listing not found.",
      };
    }

    if (deletedItem.image) {
      const cleanup = await deleteFromCloud("Images", deletedItem.image);

      if (!cleanup.success) {
        console.error(`Supabase cleanup failed: ${cleanup.message}`);
      }
    }

    return {
      success: true,
      message: "Marketplace item and associated image removed successfully.",
    };
  }
}

module.exports = new MarketplaceService();