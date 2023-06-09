const Project = require("../models/project");
const sendgrid = require("../config/sendgrid");
const Notification = require("../models/notification");
const ProjectMember = require("../models/projectmember");
const ProjectOrg = require("../models/projectorg");
const Timeline = require("../models/timeline");
const User = require("../models/user");
const utils = require("./util");

exports.createProject = async (req, res, next) => {
  try {
    const project = new Project(req.body);
    const pr = await project.save();
    const pm = new ProjectMember({
      participant: req.user._id,
      project: pr._id,
      role: "Creator",
    });
    await pm.save();
    const po = new ProjectOrg({
      organization: req.user.profile.org,
      project: pr._id,
      option: "creator",
    });
    await po.save();
    const timeline = new Timeline({
      title: `Project created by ${req.user.profile.first_name} ${req.user.profile.last_name}`,
      project: pr._id,
    });
    await timeline.save();
    const result = await Project.findById(pr._id).populate({
      path: "participant",
      select: "_id profile",
    });
    return res.status(201).json({
      project: result,
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const id = req.body._id;
    delete req.body._id;
    await Project.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    const result = await Project.findById(id)
      .populate({
        path: "participant",
        select: "_id profile",
      })
      .populate("technologies");
    res.status(201).json({ project: result });
  } catch (err) {
    return next(err);
  }
};

exports.updateProjectTechs = async (req, res, next) => {
  try {
    const id = req.body.id;
    let oldProject = await Project.findById(id);
    let techs = req.body.technologies || [];
    await Project.findOneAndUpdate(
      { _id: id },
      { technologies: techs },
      {
        new: true,
      }
    );
    for (let tech of techs) {
      let exTechs = oldProject.technologies.filter((item) => {
        return utils.compareIds(item, tech._id);
      });
      if (exTechs.length === 0) {
        const timeline = new Timeline({
          title: `Technology ${tech.title} was added to the project`,
          project: id,
        });
        await timeline.save();
      }
    }
    const result = await Project.findById(id)
      .populate({
        path: "participant",
        select: "_id profile",
      })
      .populate("technologies");
    res.status(201).json({ project: result });
  } catch (err) {
    return next(err);
  }
};

exports.voteProject = async (req, res, next) => {
  const vote = req.body.vote;
  try {
    let project = await Project.findById(req.params.id);
    let likes = project.likes;
    if (vote === false) likes.splice(likes.indexOf(req.user._id), 1);
    if (vote === true && likes.indexOf(req.user._id) === -1) {
      likes.push(req.user._id);
    }
    project.likes = likes;
    project = await project.save();
    return res.status(201).json({
      project,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getProject = (req, res, next) => {
  Project.findById(req.params.projectId)
    .populate({
      path: "participant",
      select: "_id profile",
    })
    .populate("technologies")
    .exec((err, project) => {
      if (err) {
        return next(err);
      }
      delete project.participant.email;
      res.status(201).json({ project });
    });
};

exports.listProject = async (req, res, next) => {
  try {
    const pms = await ProjectMember.find({ participant: req.user._id })
      .populate({
        path: "project",
        populate: {
          path: "participant",
          select: "_id profile",
        },
      })
      .sort({ createdAt: "desc" });
    let projects = [];
    pms.map((pm) => {
      if (!pm.project || pm.project.status === "Archived") return;
      projects.push(pm.project);
    });
    res.status(201).json({ projects });
  } catch (err) {
    return next(err);
  }
};

exports.deleteProject = (req, res, next) => {
  Project.deleteOne({ _id: req.params.projectId }).exec((err, project) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ project });
  });
};

exports.listProjectByCreator = (req, res, next) => {
  Project.find({ participant: req.params.participantId, status: "Live" })
    .sort({ createdAt: "desc" })
    .exec((err, projects) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ projects });
    });
};

exports.contactCreator = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id).populate("participant");
    if (!project.participant) {
      return res
        .status(400)
        .json({ message: "Failed to send contact information" });
    }
    sendgrid.newContactProject(
      project.participant.email,
      req.body.email,
      req.body.phone,
      req.body.message,
      req.body.gallery
    );

    let senderInfo = `<div><div>Email: ${req.body.email}</div><div>Phone: ${req.body.phone}</div></div>`;
    let notif = new Notification({
      receptors: [project.participant._id],
      alias: "contact",
      title: "New contact in " + req.body.gallery,
      body: req.body.message + senderInfo,
    });
    notif = await notif.save();
    res.status(201).json({ message: "Contact submitted successfully" });
  } catch (err) {
    return next(err);
  }
};

// for admin
exports.listAllProject = async (req, res, next) => {
  try {
    let projects = [];
    let users = await User.find({ "profile.org": req.params.org_id });
    for (let user of users) {
      let ups = await Project.find({ participant: user._id }).populate({
        path: "participant",
        select: "_id profile",
      });
      projects = [...projects, ...ups];
    }
    projects = projects.sort((a, b) => {
      if (a.createdAt > b.createdAt) return 1;
      return 0;
    });

    return res.status(201).json({
      projects,
    });
  } catch (err) {
    return next(err);
  }
};

exports.archiveProject = async (req, res, next) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, { status: "Archived" });
    return res.status(201).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

exports.unArchiveProject = async (req, res, next) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, { status: "Live" });
    return res.status(201).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

exports.getMailTemplate = (req, res, next) => {
  try {
    req.body.project_name = req.body.project_name || ""
    let result = {
      title: "Invite Email",
      html: sendgrid.inviteFactory(req.body),
    };
    return res.status(200).json({ mail: result });
  } catch (err) {
    return next(err);
  }
};
