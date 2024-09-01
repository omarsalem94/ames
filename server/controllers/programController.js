const Program = require("../models/Program");

exports.getPrograms = async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (error) {
    res.status(500).send(`Error fetching programs: ${error.message}`);
  }
};

exports.getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    res.json(program);
  } catch (error) {
    res.status(500).send(`Error fetching program: ${error.message}`);
  }
};

exports.updateProgramById = async (req, res) => {
  try {
    const updatedProgram = await Program.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProgram);
  } catch (error) {
    res.status(500).send(`Error updating program: ${error.message}`);
  }
};
