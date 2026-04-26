const Housing = require("../../middleware/models/Housing");
const { deleteFromCloud } = require("../../middleware/supabaseUpload");

class HousingService {
  async createHousing(housingData) {
    const newHousing = new Housing(housingData);
    return await newHousing.save();
  }

  async getHousingById(id) {
    return await Housing.findById(id).populate("postedBy", "name email phone");
  }

  async getAllHousing(search, location) {
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      query.address = { $regex: location, $options: "i" };
    }

    return await Housing.find(query).sort({ createdAt: -1 });
  }

  async updateHousing(id, updateData, userId) {
    const oldHousing = await Housing.findById(id);

    if (!oldHousing) {
      return {
        success: false,
        statusCode: 404,
        message: "Housing post not found.",
      };
    }

    if (oldHousing.postedBy.toString() !== userId.toString()) {
      return {
        success: false,
        statusCode: 403,
        message: "Not authorized to update this housing post.",
      };
    }

    const oldImageUrl = oldHousing.image;
    const newImageUrl = updateData.image;

    const updatedHousing = await Housing.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (newImageUrl && oldImageUrl && newImageUrl !== oldImageUrl) {
      const cleanup = await deleteFromCloud("Images", oldImageUrl);

      if (!cleanup.success) {
        console.warn(`Old housing image cleanup failed: ${cleanup.message}`);
      }
    }

    return {
      success: true,
      data: updatedHousing,
      message: "Housing post updated successfully.",
    };
  }

  async deleteHousing(id, userId) {
    const housing = await Housing.findById(id);

    if (!housing) {
      return {
        success: false,
        statusCode: 404,
        message: "Housing post not found.",
      };
    }

    if (housing.postedBy.toString() !== userId.toString()) {
      return {
        success: false,
        statusCode: 403,
        message: "Not authorized to delete this housing post.",
      };
    }

    const deletedHousing = await Housing.findByIdAndDelete(id);

    if (deletedHousing.image) {
      const cleanup = await deleteFromCloud("Images", deletedHousing.image);

      if (!cleanup.success) {
        console.error(`Supabase cleanup failed: ${cleanup.message}`);
      }
    }

    return {
      success: true,
      message: "Housing post and associated image removed successfully.",
    };
  }
}

module.exports = new HousingService();