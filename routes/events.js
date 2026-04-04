const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');
const authenticateToken = require('../middleware/auth');

// Registration routes (Must come before :id routes to avoid conflict)
router.get('/me/registrations', authenticateToken, EventController.getUserRegistrations);
router.post('/:id/register', authenticateToken, EventController.registerEvent);

router.post('/', authenticateToken, EventController.createEvent);
router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);
router.put('/:id', authenticateToken, EventController.updateEvent);
router.delete('/:id', authenticateToken, EventController.deleteEvent);


module.exports = router;