const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  moduleCode: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  facultyCode: {
    type: String,
    required: true,
  },
  academicYear: {
    type: String,
    default: "",
  },
  moduleLeader: {
    type: String,
    default: "",
  },
  studentNumbers: {
    type: Number,
    default: 0,
  },
  evaluationOperation: {
    type: String,
    default: "",
  },
  evaluationApproach: {
    type: String,
    default: "",
  },
  inclusiveCurriculum: {
    type: String,
    default: "",
  },
  effectPastChanges: {
    type: String,
    default: "",
  },
  proposedFutureChanges: {
    type: String,
    default: "",
  },
  qualityAndImprovementPlans: {
    type: String,
    default: "",
  },
  otherComments: {
    type: String,
    default: "",
  },
  author: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  email: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Module", ModuleSchema);
