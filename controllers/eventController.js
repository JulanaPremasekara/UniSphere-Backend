const EventService = require('../routes/services/eventService');

class EventController {
  static async createEvent(req, res) {
    try {
      const event = await EventService.createEvent(req.body, req.user.id, req.user.name);
      res.status(201).json({ success: true, event });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async getAllEvents(req, res) {
    try {
      const events = await EventService.getAllEvents();
      res.status(200).json({ success: true, events });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async getEventById(req, res) {
    try {
      const event = await EventService.getEventById(req.params.id);
      event ? res.status(200).json({ success: true, event }) : res.status(404).json({ success: false, message: "Not found" });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async updateEvent(req, res) {
    try {
      const event = await EventService.getEventById(req.params.id);
      if (!event || event.organizer.toString() !== req.user.id) return res.status(event ? 403 : 404).json({ success: false, message: event ? "Unauthorized" : "Not found" });
      const updatedEvent = await EventService.updateEvent(req.params.id, req.body);
      res.status(200).json({ success: true, event: updatedEvent });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async deleteEvent(req, res) {
    try {
      const event = await EventService.getEventById(req.params.id);
      if (!event || event.organizer.toString() !== req.user.id) return res.status(event ? 403 : 404).json({ success: false, message: event ? "Unauthorized" : "Not found" });
      await EventService.deleteEvent(req.params.id);
      res.status(200).json({ success: true, message: "Deleted" });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async registerEvent(req, res) {
    try {
      await EventService.registerUserForEvent(req.params.id, req.user.id);
      res.status(200).json({ success: true, message: "Registered" });
    } catch (e) {
      const status = e.message === "Event not found" ? 404 : e.message === "Already registered" ? 400 : 500;
      res.status(status).json({ success: false, message: e.message });
    }
  }

  static async getUserRegistrations(req, res) {
    try {
      const events = await EventService.getUserRegistrations(req.user.id);
      res.status(200).json({ success: true, events });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  }
}

module.exports = EventController;