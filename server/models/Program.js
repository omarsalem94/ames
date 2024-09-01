const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
  routeCode: {
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
  programLeader: {
    type: String,
    default: "",
  },
  programTeam: {
    type: String,
    default: "",
  },
  changesFromLastYear: {
    type: String,
    default: "",
  },
  studentFeedback: {
    type: String,
    default: "",
  },
  evaluation: {
    type: String,
    default: "",
  },
  futurePlanning: {
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

module.exports = mongoose.model("Program", ProgramSchema);
