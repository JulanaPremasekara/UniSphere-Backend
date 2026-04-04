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

}

module.exports = LostController;