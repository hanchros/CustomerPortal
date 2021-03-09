const ProjectOrg = require("../models/projectorg");
const Project = require("../models/project");
const ProjectMember = require("../models/projectmember");
const Timeline = require("../models/timeline");
const User = require("../models/user");
const Organization = require("../models/organization");
const Invite = require("../models/invite");

exports.joinProject = async (req, res, next) => {
  try {
    const inv = await Invite.findById(req.params.inv_id)
    if (!inv || inv.resolved !== 1) {
      return res
      .status(422)
      .send({ error: "The invitation was already resolved." });
    }
    const customer = await User.findOne({email: inv.email});
    const project = await Project.findById(inv.project)
    const org = await Organization.findOne({org_name: inv.organization})
    const pms = await ProjectMember.find({
      participant: customer._id,
      project: project._id,
    });
    if (!pms || pms.length === 0) {
      const pm = new ProjectMember({
        participant: customer._id,
        project: project._id,
      });
      await pm.save();
      let timeline = new Timeline({
        title: `${customer.profile.first_name} ${customer.profile.last_name} was invited to the project`,
        project: project._id,
      });
      await timeline.save();
    }
    const pos = await ProjectOrg.find({
      organization: org._id,
      project: project._id,
    });
    if (!pos || pos.length === 0) {
      const po = new ProjectOrg({
        organization: org._id,
        project: project._id,
      });
      await po.save();
      let tl = new Timeline({
        title: `Organization "${org.org_name}" was added to the project`,
        project: project._id,
      });
      await tl.save();
    }
    res.status(201).json({ message: "success" });
  } catch (err) {
    next(err);
  }
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
    .populate({
      path: "project",
      populate: {
        path: "participant",
        select: "_id profile",
      },
    })
    .sort({ createdAt: "desc" })
    .exec((err, pos) => {
      if (err) {
        return next(err);
      }
      let projects = [];
      pos.map((po) => {
        if (!po.project || po.project.status === "Archived") return;
        projects.push(po.project);
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
