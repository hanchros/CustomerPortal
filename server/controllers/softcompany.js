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
const SoftCompany = require("../models/softcompany");

const sendSCInvite = async (iv) => {
  const values = {
    contact: iv.first_name,
    email: iv.email,
    organization: iv.organization,
    phone: iv.profile.phone,
    sender_name: iv.profile.sender_name,
    sender_organization: iv.profile.sender_organization,
    logo: iv.profile.logo,
    content: iv.profile.content,
    invite: iv._id,
  };
  const mailContent = {
    logo: values.logo,
    content: values.content,
    email: values.email,
    sender_organization: values.sender_organization,
  };
  await utils.createSCPDFDoc(values);
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

exports.sendSoftCompanyInvite = async (req, res, next) => {
  try {
    const sender_name = `${req.user.profile.first_name} ${req.user.profile.last_name}`;
    const sender_organization = req.user.profile.org_name;
    const iv = new Invite({
      first_name: req.body.contact,
      last_name: "",
      email: req.body.email,
      organization: req.body.organization,
      profile: {
        sender_name,
        sender_organization,
        logo: req.body.logo,
        content: req.body.content,
        phone: req.body.phone,
      },
      type: 3,
    });
    const niv = await iv.save();
    await sendSCInvite(niv);
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
    await sendSCInvite(niv);
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
    await sendSCInvite(niv);
    return res.status(200).json({
      invite: niv,
    });
  } catch (err) {
    return next(err);
  }
};

exports.listSCInvite = async (req, res, next) => {
  try {
    const invites = await Invite.find({ type: 3, resolved: 1 });
    return res.status(200).json({
      invites,
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
      first_name: req.body.contact,
      last_name: "",
      email: req.body.email,
      organization: req.body.organization,
      profile: {
        sender_name,
        sender_organization,
        phone: req.body.phone,
        logo: req.body.logo,
        content: req.body.content,
      },
      type: 3,
    });
    const niv = await iv.save();
    const values = Object.assign(req.body, {
      sender_name,
      sender_organization,
      invite: niv._id,
    });
    await utils.createSCPDFDoc(values);
    await sleep(2000);
    delete values.logo;
    delete values.content;
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
    return res.status(422).send({ error: err });
  }
};

exports.inviteSCToProject = async (req, res, next) => {
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

exports.inviteRegister = async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  delete req.body.email;
  delete req.body.password;
  try {
    let users = await User.find({ email });
    let scs = await SoftCompany.find({ email });
    if (scs.length > 0 || users.length > 0) {
      return res
        .status(422)
        .send({ error: "That email address is already in use." });
    }
    let sc = new SoftCompany({
      email,
      password,
      profile: req.body,
    });
    sc = await sc.save();
    sc.password = "";
    return res.status(201).json({ softcompany: sc });
  } catch (err) {
    return next(err);
  }
};

exports.updateCompanyProfile = async function (req, res, next) {
  let profile = req.body.profile;
  let email = profile.email;
  delete profile.email;
  try {
    await SoftCompany.findByIdAndUpdate(req.user._id, {
      profile,
      email,
    });
    let softcompany = await SoftCompany.findById(req.user._id);
    return res.status(201).json({ softcompany });
  } catch (err) {
    return next(err);
  }
};

exports.listCompanies = async function (req, res, next) {
  try {
    const softcompanies = await SoftCompany.find({}, "_id profile");
    return res.status(201).json({ softcompanies });
  } catch (err) {
    return next(err);
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
