const ProjectMember = require("../models/projectmember");

exports.joinProject = (req, res, next) => {
  const pm = new ProjectMember({
    participant: req.user._id,
    project: req.params.projectId,
    role: req.body.role,
  });
  pm.save((err, pr) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ projectmember: pr });
  });
};

exports.leaveProject = (req, res, next) => {
  ProjectMember.deleteOne({
    participant: req.user._id,
    project: req.params.projectId,
  }).exec((err, pm) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ projectmember: pm });
  });
};

exports.listProject = (req, res, next) => {
  ProjectMember.find({ participant: req.params.userId })
    .populate("project")
    .sort({ createdAt: "desc" })
    .exec((err, pms) => {
      if (err) {
        return next(err);
      }
      let projects = [];
      pms.map((pm) => {
        if (!pm.project) return;
        projects.push(pm);
      });
      res.status(201).json({ projects });
    });
};

exports.listParticipant = (req, res, next) => {
  ProjectMember.find({ project: req.params.projectId })
    .populate({ path: "participant", select: "_id email profile" })
    .populate("project")
    .sort({ createdAt: "desc" })
    .exec((err, pms) => {
      if (err) {
        return next(err);
      }
      let participants = [];
      pms.map((pm) => {
        if (!pm.participant) return;
        participants.push(pm);
      });
      res.status(201).json({ participants });
    });
};
