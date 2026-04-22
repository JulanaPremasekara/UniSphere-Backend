const Event = require('../../middleware/models/Event');

class EventService {
  static async createEvent(eventData, userId, userName) {
    return await new Event({ ...eventData, organizer: userId, organizerName: userName || "Anonymous" }).save();
  }

  static async getAllEvents() {
    return await Event.find().sort({ startDate: 1 });
  }

  static async getEventById(id) {
    return await Event.findById(id);
  }

  static async updateEvent(id, updateData) {
    return await Event.findByIdAndUpdate(id, updateData, { new: true });
  }

  static async deleteEvent(id) {
    return await Event.findByIdAndDelete(id);
  }

  static async registerUserForEvent(eventId, userId) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");
    if (event.registrants.includes(userId)) throw new Error("Already registered");
    event.registrants.push(userId);
    return await event.save();
  }

  static async getUserRegistrations(userId) {
    return await Event.find({ registrants: userId }).sort({ startDate: 1 });
  }
}

module.exports = EventService;
