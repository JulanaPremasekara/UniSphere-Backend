const Event = require('../middleware/models/Event');

class EventController {
  // Create a new event
  static async createEvent(req, res) {
    try {
      const { title, startDate, endDate, location, description, tags, image } = req.body;
      
      const newEvent = new Event({
        title,
        startDate,
        endDate,
        location,
        description,
        tags,
        image,
        organizer: req.user.id, // From auth middleware
        organizerName: req.user.name || "Anonymous"
      });

      await newEvent.save();
      res.status(201).json({ success: true, event: newEvent });
    } catch (error) {
      console.error("Event Creation Error Details:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all events
  static async getAllEvents(req, res) {
    try {
      const events = await Event.find().sort({ startDate: 1 });
      res.status(200).json({ success: true, events });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // Get single event
  static async getEventById(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ success: false, message: "Event not found" });
      res.status(200).json({ success: true, event });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Update event
  static async updateEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ success: false, message: "Event not found" });

      // Only the organizer can update
      if (event.organizer.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }

      const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ success: true, event: updatedEvent });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Delete event
  static async deleteEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ success: false, message: "Event not found" });

      // Only the organizer can delete
      console.log("Delete Request Info:", { eventID: req.params.id, organizerID: event.organizer.toString(), userID: req.user.id });
      if (event.organizer.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Unauthorized: You did not create this event" });
      }

      await Event.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      console.error("Delete Error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Register for an event
  static async registerEvent(req, res) {
    try {
      console.log(`>>> Incoming Registration Request for Event ID: ${req.params.id} from User: ${req.user.id}`);
      
      const event = await Event.findById(req.params.id);
      if (!event) {
        console.error(`>>> 404: Event not found for ID: ${req.params.id}`);
        return res.status(404).json({ success: false, message: "Event not found" });
      }

      const userId = req.user.id;
      
      // Check if already registered
      if (event.registrants.includes(userId)) {
        console.log(`>>> User ${userId} already registered for event ${req.params.id}`);
        return res.status(400).json({ success: false, message: "Already registered for this event" });
      }

      event.registrants.push(userId);
      await event.save();

      console.log(`>>> Successfully registered User ${userId} for Event ${req.params.id}`);
      res.status(200).json({ success: true, message: "Registered successfully" });
    } catch (error) {
      console.error(">>> Registration Error:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get current user's registrations
  static async getUserRegistrations(req, res) {
    try {
      const userId = req.user.id;
      const registeredEvents = await Event.find({ registrants: userId }).sort({ startDate: 1 });
      res.status(200).json({ success: true, events: registeredEvents });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = EventController;