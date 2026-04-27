const StudyGroup = require("../../middleware/models/StudyGroup");

class StudyGroupService {
  async createSession(data) {
    const {
      subject,
      location,
      time,
      maxParticipants,
      tag,
      learningGoals,
      createdBy,
    } = data;

    if (
      !subject ||
      !location ||
      !time ||
      maxParticipants === undefined ||
      maxParticipants === null
    ) {
      throw new Error("Subject, location, time, and max participants are required");
    }

    const maxParticipantsNumber = Number(maxParticipants);

    if (isNaN(maxParticipantsNumber) || maxParticipantsNumber <= 0) {
      throw new Error("Max participants must be a valid number greater than 0");
    }

    const session = new StudyGroup({
      subject: subject.trim(),
      location: location.trim(),
      time: time.trim(),
      participants: 0,
      maxParticipants: maxParticipantsNumber,
      tag: tag || "GENERAL",
      learningGoals:
        learningGoals && learningGoals.length > 0
          ? learningGoals
          : ["Bring your own questions", "Collaborate on exercises"],
      createdBy,
    });

    return await session.save();
  }

  async fetchAllSessions() {
    return await StudyGroup.find().sort({ createdAt: -1 });
  }

  async fetchSessionById(id) {
    const session = await StudyGroup.findById(id);

    if (!session) {
      throw new Error("Session not found");
    }

    return session;
  }

  async updateSession(id, data) {
    const {
      subject,
      location,
      time,
      maxParticipants,
      tag,
      learningGoals,
    } = data;

    if (
      !subject ||
      !location ||
      !time ||
      maxParticipants === undefined ||
      maxParticipants === null
    ) {
      throw new Error("Subject, location, time, and max participants are required");
    }

    const maxParticipantsNumber = Number(maxParticipants);

    if (isNaN(maxParticipantsNumber) || maxParticipantsNumber <= 0) {
      throw new Error("Max participants must be a valid number greater than 0");
    }

    const updatedSession = await StudyGroup.findByIdAndUpdate(
      id,
      {
        subject: subject.trim(),
        location: location.trim(),
        time: time.trim(),
        maxParticipants: maxParticipantsNumber,
        tag: tag || "GENERAL",
        learningGoals:
          learningGoals && learningGoals.length > 0
            ? learningGoals
            : ["Bring your own questions", "Collaborate on exercises"],
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSession) {
      throw new Error("Session not found");
    }

    return updatedSession;
  }

  async removeSession(id) {
    const deleted = await StudyGroup.findByIdAndDelete(id);

    if (!deleted) {
      return {
        success: false,
        message: "Session not found",
      };
    }

    return {
      success: true,
      message: "Session cancelled successfully",
    };
  }
}

module.exports = new StudyGroupService();