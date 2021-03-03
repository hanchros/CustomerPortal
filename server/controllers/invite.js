const Invite = require("../models/invite");
const Project = require("../models/project");
const sendgrid = require("../config/sendgrid");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const utils = require("./util");

exports.createInviteRequest = async (req, res, next) => {
  try {
    let irs = await Invite.find({ email: req.body.email });
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
      type: 1,
    });
    const niv = await iv.save();
    const values = Object.assign(req.body, {
      sender_name,
      sender_organization,
      invite: niv._id,
    });
    const mailContent = {
      logo: values.logo,
      content: values.content,
      email: values.email,
      sender_organization,
      project_name: values.project_name,
    };
    const project = await Project.findById(values.project_id);
    utils.createPDFDoc(values, project.description);
    await sleep(3000);

    delete values.logo;
    delete values.content;
    delete values.project_description;
    const form = new FormData();
    form.append(
      "file",
      fs.createReadStream(`${__dirname}/../uploads/orginvite.pdf`)
    );
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
    let filename = `invite_${new Date().getTime().toString(36)}.pdf`;
    let path = `${__dirname}/../uploads/${filename}`;
    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);
    writer.on("close", () => {
      sendgrid.inviteMail(mailContent, filename);
    });
    return res.status(200).json({
      invite: niv,
    });
  } catch (err) {
    return next(err);
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
  Invite.find({ resolved: 1, type: 1, project: req.params.project_id }).exec(
    (err, irs) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        invites: irs,
      });
    }
  );
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
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
