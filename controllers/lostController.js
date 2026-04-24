const { success } = require('zod');
const lostitemService = require('../routes/services/lostService');

class LostController {

    static async createLost(req, res) {
        try {
            const validatedData = req.body;
            const finalData={
                ...validatedData,
                reporter:req.user.id}

            const savedItem = await lostitemService.reportLostItem(finalData);
            res.status(201).json({ success: true, data: savedItem });
        } catch (error) {
            console.error('Error reporting lost item:', error);
            res.status(400).json({ success: false, message: 'Internal server error' });
        }
    }

    static async getLostItemById(req, res) {
        try {
            const { id } = req.params;
            const item = await lostitemService.getLostItemById(id);
            if (!item) {
                return res.status(404).json({ success: false, message: 'Item not found' });
            }
            res.status(200).json({ success: true, data: item });
        } catch (error) {
            console.error('Error fetching lost item:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async getAllLostItems(req, res) {
        try {
            const items = await lostitemService.getAllLostItems();
            res.status(200).json({ success: true, data: items });
        } catch (error) {
            console.error('Error fetching lost items:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }


    static async updateLost(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const result = await lostitemService.updateLostItem(id, updateData);

            if (!result.success) {
                return res.status(404).json(result);
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Controller Error updating item:', error);
            res.status(500).json({ 
                success: false, 
                message: 'A technical error occurred while updating the item.' 
            });
        }
    }

    static async deleteLost(req, res) {
        try {
            const { id } = req.params;

            // Call the service which now handles both Mongo and Supabase
            const result = await lostitemService.deleteLostItem(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Controller Error deleting item:', error);
            res.status(500).json({ 
                success: false, 
                message: 'A technical error occurred on the server.' 
            });
        }
    }

}

module.exports = LostController;