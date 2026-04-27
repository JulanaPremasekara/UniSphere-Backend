const express = require("express");
const router = express.Router();

const StudyGroupController = require("../controllers/studyGroupController");
const validate = require("../middleware/schemavalidate");

const {
  createStudyGroupSchema,
  StudyGroupIDSchema,
} = require("../middleware/schemas/studyGroupSchema");

// Create a new group
router.post("/", validate(createStudyGroupSchema), StudyGroupController.create);

// Get all groups
router.get("/", StudyGroupController.getAll);

// Get one group
router.get(
  "/:id",
  validate(StudyGroupIDSchema, "params"),
  StudyGroupController.getById
);

// Update/Edit a group
router.put(
  "/:id",
  validate(StudyGroupIDSchema, "params"),
  validate(createStudyGroupSchema),
  StudyGroupController.update
);

// Delete/Cancel a group
router.delete(
  "/:id",
  validate(StudyGroupIDSchema, "params"),
  StudyGroupController.delete
);

module.exports = router;