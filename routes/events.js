const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/schemavalidate');
const { createEventSchema, updateEventSchema, eventIdParamSchema } = require('../middleware/schemas/eventSchema');

// Registration routes (Must come before :id routes to avoid conflict)
router.get('/me/registrations', authenticateToken, EventController.getUserRegistrations);
router.post('/:id/register', authenticateToken, validate(eventIdParamSchema, 'params'), EventController.registerEvent);

router.post('/', authenticateToken, validate(createEventSchema), EventController.createEvent);
router.get('/', EventController.getAllEvents);
router.get('/:id', validate(eventIdParamSchema, 'params'), EventController.getEventById);
router.put('/:id', authenticateToken, validate(eventIdParamSchema, 'params'), validate(updateEventSchema), EventController.updateEvent);
router.delete('/:id', authenticateToken, validate(eventIdParamSchema, 'params'), EventController.deleteEvent);

module.exports = router;