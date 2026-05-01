const StudyGroup = require("../../middleware/models/StudyGroup");
const { deleteFromCloud } = require("../../middleware/supabaseUpload");

class StudyGroupService {
  async createSession(data) {
    const {
      subject,
      location,
      time,
      maxParticipants,
      tag,
      learningGoals,
      image,
      createdBy,
    } = data;

    if (
      !subject ||
      !location ||
      !time ||
      maxParticipants === undefined ||
      maxParticipants === null
    ) {
      throw new Error(
        "Subject, location, time, and max participants are required",
      );
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
      image: image || null,
      createdBy: createdBy,
    });

    return await session.save();
  }

  async fetchAllSessions() {
    return await StudyGroup.find().sort({ createdAt: -1 });
  }

  async fetchSessionById(id) {
    const session = await StudyGroup.findById(id);

    if (!session) {
      return {
        success: false,
        message: "Session not found",
      };
    }

    return {
      success: true,
      data: session,
      message: "Session fetched successfully",
    };
  }

  async updateSession(id, data) {
    const {
      subject,
      location,
      time,
      maxParticipants,
      tag,
      learningGoals,
      image,
    } = data;

    if (
      !subject ||
      !location ||
      !time ||
      maxParticipants === undefined ||
      maxParticipants === null
    ) {
      throw new Error(
        "Subject, location, time, and max participants are required",
      );
    }

    const maxParticipantsNumber = Number(maxParticipants);

    if (isNaN(maxParticipantsNumber) || maxParticipantsNumber <= 0) {
      throw new Error("Max participants must be a valid number greater than 0");
    }

    // 1. Find existing session first
    const oldSession = await StudyGroup.findById(id);

    if (!oldSession) {
      return {
        success: false,
        message: "Session not found",
      };
    }

    const oldImageUrl = oldSession.image;
    const newImageUrl = image;

    // 2. Update MongoDB record
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
        image: image || null,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    // 3. Delete old image if new image changed
    if (newImageUrl && oldImageUrl && newImageUrl !== oldImageUrl) {
      const cleanup = await deleteFromCloud("Images", oldImageUrl);

      if (!cleanup.success) {
        console.warn(
          `Old study group image cleanup failed: ${cleanup.message}`,
        );
      }
    }

    return {
      success: true,
      data: updatedSession,
      message: "Session updated successfully",
    };
  }

  async joinSession(id, userId) {
    const session = await StudyGroup.findById(id);

    if (!session) {
      return {
        success: false,
        message: "Session not found",
      };
    }

    // ensure participants exists
    if (!session.participants) {
      session.participants = 0;
    }

    // prevent overfill
    if (session.participants >= session.maxParticipants) {
      return {
        success: false,
        message: "Study group is already full",
      };
    }

    // 🔥 OPTIONAL (but strongly recommended)
    if (!session.joinedUsers) {
      session.joinedUsers = [];
    }

    if (session.joinedUsers.includes(userId)) {
      return {
        success: false,
        message: "You already joined this group",
      };
    }

    // update
    session.participants += 1;
    session.joinedUsers.push(userId);

    await session.save();

    return {
      success: true,
      data: session,
      message: "Joined study group successfully",
    };
  }

  async removeSession(id) {
    // 1. Delete session from MongoDB
    const deletedSession = await StudyGroup.findByIdAndDelete(id);

    if (!deletedSession) {
      return {
        success: false,
        message: "Session not found",
      };
    }

    // 2. Delete image from Supabase
    if (deletedSession.image) {
      const cleanup = await deleteFromCloud("Images", deletedSession.image);

      if (!cleanup.success) {
        console.error(`Supabase cleanup failed: ${cleanup.message}`);
      }
    }

    return {
      success: true,
      message: "Session and associated image removed successfully",
    };
  }
}

module.exports = new StudyGroupService();
