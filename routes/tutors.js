const express = require('express');
const router = express.Router();
const TutorController = require('../controllers/tutorController');
const authenticateToken = require('../middleware/auth');
const { parseImage } = require('../middleware/multer');
const { handleCloudUpload } = require('../middleware/supabaseUpload');

// Import your schemas
const { 
    createTutorSchema, 
    TutorIDParamSchema, 
    updateStatusSchema 
} = require('../middleware/schemas/tutorSchema');

// Import your validation middleware
const validate = require('../middleware/schemavalidate');

// POST: Create profile (Validates Body)
router.post('/setup', validate(createTutorSchema), TutorController.createTutor);

// GET: All online tutors (No specific validation needed unless you add search filters)
router.get('/', TutorController.getAllTutors);

// GET: Single tutor profile details (Validates ID in Params)
router.get('/:id', validate(TutorIDParamSchema, 'params'), TutorController.getTutorById);

// PATCH: Toggle online/offline status (Validates ID in Params AND Body)
router.patch('/:id/status', 
    validate(TutorIDParamSchema, 'params'), 
    TutorController.toggleStatus
);

// DELETE: Remove tutor account (Validates ID in Params)
router.delete('/:id', validate(TutorIDParamSchema, 'params'), TutorController.deleteTutor);

module.exports = router;
