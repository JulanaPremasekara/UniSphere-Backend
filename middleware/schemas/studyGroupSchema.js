const { z } = require("zod");

const createStudyGroupSchema = z.object({
  subject: z.string().min(3, "Subject is too short").max(100),

  location: z.string().min(3, "Location is required"),

  time: z.string().min(1, "Time is required"),

  maxParticipants: z
    .number({
      required_error: "Max participants is required",
      invalid_type_error: "Max participants must be a number",
    })
    .int("Max participants must be a whole number")
    .min(1, "Max participants must be at least 1"),

  participants: z.number().int().min(0).optional(),

  tag: z.string().optional(),

  learningGoals: z.array(z.string()).optional(),
  image:z.string().optional(),
});

const StudyGroupIDSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Session ID format"),
});

module.exports = {
  createStudyGroupSchema,
  StudyGroupIDSchema,
};