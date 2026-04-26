const Lost = require("../../middleware/models/Lost");
const { deleteFromCloud } = require("../../middleware/supabaseUpload");

class LostService {
  async reportLostItem(itemData) {
    const newlostItem = new Lost(itemData);
    return await newlostItem.save();
  }

  async getLostItemById(id) {
    return await Lost.findById(id);
  }

  async getAllLostItems() {
    return await Lost.find();
  }

  async resolveLostItem(id) {
    const item = await Lost.findById(id);

    if (!item) {
      return {
        success: false,
        message: "Item not found.",
      };
    }

    const resolvedItem = await Lost.findByIdAndUpdate(
      id,
      { status: "resolved" },
      { new: true },
    );

    return {
      success: true,
      data: resolvedItem,
      message: "Item marked as resolved successfully.",
    };
  }

  async updateLostItem(id, updateData) {
    // 1. Find the existing item to check for an old image
    const oldItem = await Lost.findById(id);
    if (!oldItem) {
      return { success: false, message: "Item not found." };
    }

    const oldImageUrl = oldItem.image;
    const newImageUrl = updateData.image;

    // 2. Update the record in MongoDB
    const updatedItem = await Lost.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // 3. Cleanup logic: If a new image was uploaded, delete the old one
    if (newImageUrl && oldImageUrl && newImageUrl !== oldImageUrl) {
      // We don't 'await' this if we want the response to be faster,
      // but it's safer to await to ensure cleanup happens.
      const cleanup = await deleteFromCloud("Images", oldImageUrl);

      if (!cleanup.success) {
        console.warn(`Old image cleanup failed: ${cleanup.message}`);
      }
    }

    return {
      success: true,
      data: updatedItem,
      message: "Item updated successfully.",
    };
  }

  async deleteLostItem(id) {
    // 1. Delete the record from MongoDB
    const deletedItem = await Lost.findByIdAndDelete(id);

    if (!deletedItem) {
      return {
        success: false,
        message: "The record was not found in our database.",
      };
    }

    // 2. If the record had an image, clean up Supabase
    if (deletedItem.image) {
      const cleanup = await deleteFromCloud("Images", deletedItem.image);

      // If Supabase fails, we log it for the admin but the DB record is already gone
      if (!cleanup.success) {
        console.error(`Supabase Cleanup Failed: ${cleanup.message}`);
      }
    }

    return {
      success: true,
      message: "Item and associated image removed successfully.",
    };
  }
}

module.exports = new LostService();
