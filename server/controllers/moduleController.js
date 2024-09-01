const Module = require("../models/Module");

exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (error) {
    res.status(500).send(`Error fetching modules: ${error.message}`);
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    res.json(module);
  } catch (error) {
    res.status(500).send(`Error fetching module: ${error.message}`);
  }
};

exports.updateModuleById = async (req, res) => {
  try {
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedModule);
  } catch (error) {
    res.status(500).send(`Error updating module: ${error.message}`);
  }
};
