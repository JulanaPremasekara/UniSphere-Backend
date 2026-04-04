const Lost = require('../../middleware/models/Lost');

class LostService {
   
    async reportLostItem(itemData) {
        const newlostItem = new Lost(itemData);
        return await newlostItem.save();
    }
}

module.exports = new LostService();