const Event = require('../middleware/models/Event');

class EventController {
  static async createEvent(req, res) {
    try {
      const event = await new Event({ ...req.body, organizer: req.user.id, organizerName: req.user.name || "Anonymous" }).save();
      res.status(201).json({ success: true, event });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async getAllEvents(req, res) {
    try { res.status(200).json({ success: true, events: await Event.find().sort({ startDate: 1 }) }); } 
    catch (e) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async getEventById(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      event ? res.status(200).json({ success: true, event }) : res.status(404).json({ success: false, message: "Not found" });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async updateEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event || event.organizer.toString() !== req.user.id) return res.status(event ? 403 : 404).json({ success: false, message: event ? "Unauthorized" : "Not found" });
      res.status(200).json({ success: true, event: await Event.findByIdAndUpdate(req.params.id, req.body, { new: true }) });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async deleteEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event || event.organizer.toString() !== req.user.id) return res.status(event ? 403 : 404).json({ success: false, message: event ? "Unauthorized" : "Not found" });
      await Event.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: "Deleted" });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async registerEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ success: false, message: "Not found" });
      if (event.registrants.includes(req.user.id)) return res.status(400).json({ success: false, message: "Already registered" });
      event.registrants.push(req.user.id);
      await event.save();
      res.status(200).json({ success: true, message: "Registered" });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async getUserRegistrations(req, res) {
    try { res.status(200).json({ success: true, events: await Event.find({ registrants: req.user.id }).sort({ startDate: 1 }) }); }
    catch (e) { res.status(500).json({ success: false, message: e.message }); }
  }
}

module.exports = EventController;