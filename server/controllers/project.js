const Project = require("../models/project");
const sendgrid = require("../config/sendgrid");
const Notification = require("../models/notification");
const ProjectMember = require("../models/projectmember");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

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
    return res.status(201).json({
      project: pr,
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateProject = (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  Project.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true },
    (err, project) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ project });
    }
  );
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
      .populate("project")
      .sort({ createdAt: "desc" });
    let projects = [];
    pms.map((pm) => {
      if (!pm.project) return;
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
  Project.find({ participant: req.params.participantId })
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
    let projects = await Project.find({});
    let result = [];
    for (let proj of projects) {
      result.push({
        project_name: proj.name,
        logo: proj.logo,
        objective: proj.objective,
        status: proj.status,
        contact_detail: proj.contact_detail,
        _id: proj._id,
      });
    }
    return res.status(201).json({
      projects: result,
    });
  } catch (err) {
    return next(err);
  }
};

exports.sendInvite = async (req, res, next) => {
  try {
    const sender_name = `${req.user.profile.first_name} ${req.user.profile.last_name}`;
    const sender_organization = req.user.profile.org_name;
    const values = Object.assign(req.body, {
      sender_name,
      sender_organization,
    });
    const mailContent = {
      logo: values.logo,
      content: values.content,
      email: values.email,
    };

    delete values.logo;
    delete values.content;
    const form = new FormData();
    const pdfData = fs.readFileSync(`${__dirname}/../template/orginvite.pdf`);
    form.append("file", pdfData);
    form.append("data_form", JSON.stringify(values));
    form.append("meta_form", JSON.stringify(values));
    form.append("master_id", "123456789");

    let response = await axios.post(
      "http://integraapiproduction.azurewebsites.net/pdf",
      form,
      {
        headers: form.getHeaders(),
        responseType: "stream",
      }
    );
    let filename = `${new Date().getTime().toString(36)}.pdf`;
    let path = `${__dirname}/../uploads/${filename}`;
    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);
    writer.on("close", () => {
      sendgrid.inviteMail(mailContent, filename);
    });
    return res.status(200).json({
      content: "success",
    });
  } catch (err) {
    return next(err);
  }
};

exports.getMailTemplate = (req, res, next) => {
  try {
    let result = {
      title: "Invite Email",
      html: sendgrid.inviteFactory(req.body),
    };
    return res.status(200).json({ mail: result });
  } catch (err) {
    return next(err);
  }
};
