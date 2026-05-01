const mongoose = require("mongoose");

const studyGroupSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    time: {
      type: String,
      required: true,
      trim: true,
    },

    tag: {
      type: String,
      default: "GENERAL",
    },

    participants: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
      default: 12,
    },

    learningGoals: {
      type: [String],
      default: ["Bring your own questions", "Collaborate on exercises"],
    },
    image: {
      type: String,
      default: null,
    },
    joinedUsers: [
      {
        type: String,
        ref: "User",
      },
    ],

    createdBy: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("StudyGroup", studyGroupSchema);
