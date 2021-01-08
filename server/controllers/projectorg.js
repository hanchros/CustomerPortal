const ProjectOrg = require("../models/projectorg");

exports.joinProject = (req, res, next) => {
  const po = new ProjectOrg({
    organization: req.body.organization,
    project: req.params.projectId,
  });
  po.save((err, pr) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ projectOrg: pr });
  });
};

exports.leaveProject = (req, res, next) => {
  ProjectOrg.deleteOne({
    organization: req.body.organization,
    project: req.params.projectId,
  }).exec((err, po) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ projectOrg: po });
  });
};

exports.listProject = (req, res, next) => {
  ProjectOrg.find({ organization: req.params.orgId })
    .populate("project")
    .sort({ createdAt: "desc" })
    .exec((err, pos) => {
      if (err) {
        return next(err);
      }
      let projects = [];
      pos.map((po) => {
        if (!po.project) return;
        projects.push(po);
      });
      res.status(201).json({ projects });
    });
};

exports.listOrganization = (req, res, next) => {
  ProjectOrg.find({ project: req.params.projectId })
    .populate("organization")
    .populate("project")
    .sort({ createdAt: "desc" })
    .exec((err, pos) => {
      if (err) {
        return next(err);
      }
      let organizations = [];
      pos.map((po) => {
        if (!po.organization) return;
        organizations.push(po);
      });
      res.status(201).json({ organizations });
    });
};
