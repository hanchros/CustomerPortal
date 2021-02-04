const Template = require("../models/template");
const Project = require("../models/project");

exports.createTemplate = (req, res, next) => {
  const template = new Template(req.body);
  template.save((err, tp) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      template: tp,
    });
  });
};

exports.updateTemplate = async (req, res, next) => {
  try {
    const id = req.body._id;
    delete req.body._id;
    await Template.findByIdAndUpdate(id, req.body);
    const template = await Template.findById(id);
    res.send({ template });
  } catch (err) {
    return next(err);
  }
};

exports.listTemplateByOrg = async (req, res, next) => {
  try {
    const templates = await Template.find({
      creator: req.params.orgId,
    }).populate("creator");
    res.status(201).json({ templates });
  } catch (err) {
    return next(err);
  }
};

exports.listTemplateGlobal = async (req, res, next) => {
  try {
    const templates = await Template.find({ creator: null });
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
    const projects = await Project.find({ template: req.params.id });
    template.projects = projects;
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
