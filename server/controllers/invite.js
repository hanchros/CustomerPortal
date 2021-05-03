const Invite = require("../models/invite");
const Project = require("../models/project");
const Notification = require("../models/notification");
const Organization = require("../models/organization");
const User = require("../models/user");
const sendgrid = require("../config/sendgrid");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const utils = require("./util");
const sockets = require("../socket");

exports.createInviteRequest = async (req, res, next) => {
  try {
    let irs = await Invite.find({ email: req.body.email, resolved: 1 });
    if (irs.length > 0) {
      return res
        .status(422)
        .send({ error: "That email address is already in use." });
    }
    const ir = new Invite(Object.assign({ type: 0 }, req.body));
    const result = await ir.save();
    // sendgrid.inviteRequestMail(
    //   Object.assign(
    //     {
    //       admin_name: "David Fisher",
    //       admin_email: "dfisher@integraledger.com",
    //     },
    //     req.body
    //   )
    // );
    res.status(201).json({
      invite: result,
    });
  } catch (err) {
    return next(err);
  }
};

const sendInviteEmail = async (iv) => {
  const values = {
    first_name: iv.first_name,
    last_name: iv.last_name,
    email: iv.email,
    organization: iv.organization,
    project_id: iv.project,
    sender_name: iv.profile.sender_name,
    sender_organization: iv.profile.sender_organization,
    logo: iv.profile.logo,
    content: iv.profile.content,
    invite: iv._id,
  };
  const project = await Project.findById(values.project_id);
  const mailContent = {
    logo: values.logo,
    content: values.content,
    email: values.email,
    sender_organization: values.sender_organization,
    project_name: project.name,
  };
  await utils.createPDFDoc(values, project.description);
  await sleep(2000);
  delete values.logo;
  delete values.content;
  const form = new FormData();
  const orgPdfPath = `${__dirname}/../uploads/${iv._id}.pdf`;
  form.append("file", fs.createReadStream(orgPdfPath));
  form.append("data_form", JSON.stringify(values));
  form.append("meta_form", JSON.stringify(values));
  form.append("master_id", "123456789");
  form.append("cartridge_type", "Organization");

  let response = await axios.post(
    "http://integraapiproduction.azurewebsites.net/pdf",
    form,
    {
      headers: form.getHeaders(),
      responseType: "stream",
    }
  );
  utils.removeFile(orgPdfPath);
  utils.removeFile(`${__dirname}/../uploads/${iv._id}.png`);
  let filename = `invite_${new Date().getTime().toString(36)}.pdf`;
  let path = `${__dirname}/../uploads/${filename}`;
  const writer = fs.createWriteStream(path);
  response.data.pipe(writer);
  writer.on("close", () => {
    sendgrid.inviteMail(mailContent, filename);
  });
};

exports.sendInviteNewMember = async (req, res, next) => {
  try {
    const sender_name = `${req.user.profile.first_name} ${req.user.profile.last_name}`;
    const sender_organization = req.user.profile.org_name;
    const iv = new Invite({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      organization: req.body.organization,
      project: req.body.project_id,
      profile: {
        sender_name,
        sender_organization,
        logo: req.body.logo,
        content: req.body.content,
      },
      type: 1,
    });
    const niv = await iv.save();
    await sendInviteEmail(niv);
    return res.status(200).json({
      invite: niv,
    });
  } catch (err) {
    return next(err);
  }
};

exports.notifyInvite = async (req, res, next) => {
  try {
    const niv = await Invite.findById(req.params.inv_id);
    await sendInviteEmail(niv);
    return res.status(200).json({
      invite: niv,
    });
  } catch (err) {
    return next(err);
  }
};

exports.editInviteNewMember = async (req, res, next) => {
  try {
    const niv = await Invite.findById(req.params.inv_id);
    niv.email = req.body.email;
    await niv.save();
    await sendInviteEmail(niv);
    return res.status(200).json({
      invite: niv,
    });
  } catch (err) {
    return next(err);
  }
};

exports.downloadInvitePDF = async (req, res, next) => {
  try {
    const sender_name = `${req.user.profile.first_name} ${req.user.profile.last_name}`;
    const sender_organization = req.user.profile.org_name;
    const iv = new Invite({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      organization: req.body.organization,
      project: req.body.project_id,
      type: 1,
    });
    const niv = await iv.save();
    const values = Object.assign(req.body, {
      sender_name,
      sender_organization,
      invite: niv._id,
    });
    const project = await Project.findById(values.project_id);
    await utils.createPDFDoc(values, project.description);
    await sleep(2000);
    delete values.logo;
    delete values.content;
    delete values.project_description;
    const form = new FormData();
    const orgPdfPath = `${__dirname}/../uploads/${niv._id}.pdf`;
    form.append("file", fs.createReadStream(orgPdfPath));
    form.append("data_form", JSON.stringify(values));
    form.append("meta_form", JSON.stringify(values));
    form.append("master_id", "123456789");
    form.append("cartridge_type", "Organization");

    let response = await axios.post(
      "http://integraapiproduction.azurewebsites.net/pdf",
      form,
      {
        headers: form.getHeaders(),
        responseType: "stream",
      }
    );
    utils.removeFile(orgPdfPath);
    utils.removeFile(`${__dirname}/../uploads/${niv._id}.png`);
    let filename = `invite_${new Date().getTime().toString(36)}.pdf`;
    let path = `${__dirname}/../uploads/${filename}`;
    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);
    writer.on("close", () => {
      res.download(path, "invite.pdf");
    });
  } catch (err) {
    return next(err);
  }
};

exports.inviteOrgToProject = async (req, res, next) => {
  try {
    const customer = await User.findById(req.body.user);
    const org = await Organization.findById(req.body.organization);
    const iv = new Invite({
      first_name: customer.profile.first_name,
      last_name: customer.profile.last_name,
      email: customer.email,
      organization: org.org_name,
      project: req.params.projectId,
      type: 2,
    });
    const niv = await iv.save();
    const project = await Project.findById(req.params.projectId);

    let notif = new Notification({
      receptors: [req.body.user],
      alias: "invite ex_org",
      title: "You are invited",
      body: `Hi, ${customer.profile.first_name}, ${customer.profile.last_name}, You are invited in the project "<a href='${sendgrid.mainURL}/project/${project._id}' target='_blank'>${project.name}</a>" by the company "<a href='${sendgrid.mainURL}/${req.user.profile.org_name}' target='_blank'>${req.user.profile.org_name}</a>"`,
      author: req.user._id,
      status: "pending",
      invite: niv._id,
    });
    notif = await notif.save();

    const io = sockets.io;
    for (let key in io.sockets.sockets) {
      if (io.sockets.sockets.hasOwnProperty(key)) {
        io.sockets.sockets[key].emit("NEW_NOTIFICATION", {
          notification: notif,
        });
      }
    }
    res.status(201).json({ invite: niv });
  } catch (err) {
    next(err);
  }
};

exports.listInviteRequest = (req, res, next) => {
  Invite.find({ resolved: 1, type: 0 }).exec((err, irs) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      invites: irs,
    });
  });
};

exports.listInvitesByProjects = (req, res, next) => {
  Invite.find({
    resolved: 1,
    type: [1, 2],
    project: req.params.project_id,
  }).exec((err, irs) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      invites: irs,
    });
  });
};

exports.getInvite = (req, res, next) => {
  Invite.findById(req.params.id).exec((err, iv) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      invite: iv,
    });
  });
};

exports.resolveInvite = async (req, res, next) => {
  try {
    ir = await Invite.findById(req.params.id);
    ir.resolved = 2;
    ir.save();
    res.status(201).json({
      invite: ir,
    });
  } catch (err) {
    return next(err);
  }
};

exports.cancelInvite = async (req, res, next) => {
  try {
    ir = await Invite.findById(req.params.id);
    ir.resolved = 0;
    ir.save();
    res.status(201).json({
      invite: ir,
    });
  } catch (err) {
    return next(err);
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
