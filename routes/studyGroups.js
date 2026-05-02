const authenticateToken = require('../middleware/auth');
const express = require("express");
const router = express.Router();
const StudyGroupController = require("../controllers/studyGroupController");
const validate = require("../middleware/schemavalidate");

const {
  createStudyGroupSchema,
  StudyGroupIDSchema,
} = require("../middleware/schemas/studyGroupSchema");
const { parseImage } = require('../middleware/multer');
const { handleCloudUpload } = require('../middleware/supabaseUpload');
const parseFormData = require('../middleware/parseFormData');

// Create a new group
router.post("/",authenticateToken,parseImage('image'),handleCloudUpload('Images','StudyGroups'),parseFormData({ numbers: ['maxParticipants'],arrays: ["learningGoals"], }), validate(createStudyGroupSchema), StudyGroupController.create);

// Get all groups
router.get("/", StudyGroupController.getAll);

// Get one group
router.get("/:id",validate(StudyGroupIDSchema, "params"),StudyGroupController.getById);
// Join a study group - increase participants by 1
router.patch("/:id/join",authenticateToken,validate(StudyGroupIDSchema, "params"),StudyGroupController.join);

// Update/Edit a group
router.put(
  "/:id",authenticateToken,parseImage('image'),handleCloudUpload('Images','StudyGroups'),parseFormData({ numbers: ['maxParticipants'],arrays: ["learningGoals"], }),validate(StudyGroupIDSchema, "params"),validate(createStudyGroupSchema),StudyGroupController.update);

// Delete/Cancel a group
router.delete("/:id",authenticateToken,validate(StudyGroupIDSchema, "params"),StudyGroupController.delete);

module.exports = router;