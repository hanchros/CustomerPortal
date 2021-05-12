const Diagram = require("../models/diagram");

exports.bulkUpdateDiagram = async (req, res, next) => {
  const diagrams = req.body.diagrams;
  try {
    await Diagram.deleteMany({ project: req.params.project_id });
    for (let dia of diagrams) {
      let newDia = new Diagram(dia);
      await newDia.save();
    }
    const newDias = await Diagram.find({ project: req.params.project_id });
    res.status(201).json({
      diagrams: newDias,
    });
  } catch (err) {
    return next(err);
  }
};

exports.listDiagram = async (req, res, next) => {
  try {
    const diagrams = await Diagram.find({ project: req.params.project_id });
    res.status(201).json({
      diagrams,
    });
  } catch (err) {
    return next(err);
  }
};
