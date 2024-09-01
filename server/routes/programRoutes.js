const express = require("express");
const {
  getPrograms,
  getProgramById,
  updateProgramById,
} = require("../controllers/programController");

const router = express.Router();

router.get("/", getPrograms);
router.get("/:id", getProgramById);
router.put("/:id", updateProgramById);

module.exports = router;
