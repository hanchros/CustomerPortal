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

exports.listTemplate = (req, res, next) => {
  Template.find({}).exec((err, tps) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      templates: tps,
    });
  });
};

exports.getTemplate = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.id).populate({
      path: "creator",
      select: "_id profile",
    });
    const projects = await Project.find({ template: req.params.id });
    template.projects = projects;
    res.status(201).json({ template });
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
