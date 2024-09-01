const express = require("express");
const {
  getModules,
  getModuleById,
  updateModuleById,
} = require("../controllers/moduleController");

const router = express.Router();

router.get("/", getModules);
router.get("/:id", getModuleById);
router.put("/:id", updateModuleById);

module.exports = router;
