const tutorService = require('../routes/services/tutorService');

class TutorController {

    static async createTutor(req, res) {
        try {
            const validatedData = req.body;
            const finalUser={...validatedData,createdBy:req.user.id,}
            const savedTutor = await tutorService.registerTutor(finalUser);
            res.status(201).json({ success: true, data: savedTutor });
        } catch (error) {
            console.error('Error creating tutor:', error);
            res.status(400).json({ success: false, message: error.message || 'Internal server error' });
        }
    }

    static async getAllTutors(req, res) {
        try {
            const tutors = await tutorService.fetchActiveTutors();
            res.status(200).json({ success: true, data: tutors });
        } catch (error) {
            console.error('Error fetching tutors:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async getTutorById(req, res) {
        try {
            const { id } = req.params;
            const tutor = await tutorService.fetchTutorDetails(id);
            res.status(200).json({ success: true, data: tutor });
        } catch (error) {
            console.error('Error fetching tutor details:', error);
            const statusCode = error.message === "Tutor not found" ? 404 : 500;
            res.status(statusCode).json({ success: false, message: error.message });
        }
    }

    static async toggleStatus(req, res) {
        try {
            const { id } = req.params;
            const result = await tutorService.updateTutorStatus(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error updating tutor status:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async deleteTutor(req, res) {
        try {
            const { id } = req.params;
            const result = await tutorService.removeTutorRecord(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error deleting tutor:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

module.exports = TutorController;