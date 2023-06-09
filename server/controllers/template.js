const Template = require("../models/template");
const Project = require("../models/project");

exports.createTemplate = async (req, res, next) => {
  try {
    let template = new Template(req.body);
    template = await template.save();
    template = await Template.findById(template._id)
      .populate("creator")
      .populate("technologies");
    res.send({ template });
  } catch (err) {
    return next(err);
  }
};

exports.updateTemplate = async (req, res, next) => {
  try {
    const id = req.body._id;
    delete req.body._id;
    await Template.findByIdAndUpdate(id, req.body);
    const template = await Template.findById(id)
      .populate("creator")
      .populate("technologies");
    const projects = await Project.find({ template: id, status: "Live" });
    res.send({ template, projects });
  } catch (err) {
    return next(err);
  }
};

exports.listTemplateByOrg = async (req, res, next) => {
  try {
    const templates = await Template.find({
      creator: req.params.orgId,
    })
      .populate("creator")
      .populate("technologies");
    res.status(201).json({ templates });
  } catch (err) {
    return next(err);
  }
};

exports.listTemplateGlobal = async (req, res, next) => {
  try {
    const templates = await Template.find({ creator: null }).populate(
      "technologies"
    );
    res.status(201).json({ templates });
  } catch (err) {
    return next(err);
  }
};

exports.getTemplate = async (req, res, next) => {
  try {
    let template = await Template.findById(req.params.id)
      .populate("creator")
      .populate("technologies");
    const projects = await Project.find({
      template: req.params.id,
      status: "Live",
    });
    res.status(201).json({ template, projects });
  } catch (err) {
    return next(err);
  }
};

exports.deleteTemplate = (req, res, next) => {
  Template.deleteOne({ _id: req.params.id }).exec((err, tp) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      template: tp,
    });
  });
};
