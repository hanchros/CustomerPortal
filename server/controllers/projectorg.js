const ProjectOrg = require("../models/projectorg");
const ProjectMember = require("../models/projectmember");
const Timeline = require("../models/timeline");
const User = require("../models/user");
const Project = require("../models/project");
const sendgrid = require("../config/sendgrid");
const Organization = require("../models/organization");

exports.joinProject = async (req, res, next) => {
  try {
    const customer = await User.findById(req.body.user);
    const pms = await ProjectMember.find({
      participant: req.body.user,
      project: req.params.projectId,
    });
    if (!pms || pms.length === 0) {
      const pm = new ProjectMember({
        participant: req.body.user,
        project: req.params.projectId,
      });
      await pm.save();
      let timeline = new Timeline({
        title: `${customer.profile.first_name} ${customer.profile.last_name} was invited to the project`,
        project: req.params.projectId,
      });
      await timeline.save();
    }
    if (req.body.organization) {
      const org = await Organization.findById(req.body.organization);
      const pos = await ProjectOrg.find({
        organization: req.body.organization,
        project: req.params.projectId,
      });
      if (!pos || pos.length === 0) {
        const po = new ProjectOrg({
          organization: req.body.organization,
          project: req.params.projectId,
        });
        await po.save();
        let tl = new Timeline({
          title: `Organization "${org.org_name}" was added to the project`,
          project: req.params.projectId,
        });
        await tl.save();
      }
    }
    const project = await Project.findById(req.params.projectId);
    const content = `<p>Hi, ${customer.profile.first_name} ${
      customer.profile.last_name
    }</p><p>You ${
      req.body.organization ? "and your organization " : ""
    } are invited in the project "${project.name}" by the company "${
      req.user.profile.org_name
    }"</p>`;
    sendgrid.joinProjectMail({
      email: customer.email,
      logo:
        project.logo ||
        "https://hackathon-cretech.s3.us-east-2.amazonaws.com/7e68ac9b-cc75-4d15-a8e1-a07a9e48bc90.png",
      content,
    });
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
