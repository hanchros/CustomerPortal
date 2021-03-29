const Mail = require("../models/mail");
const sendgrid = require("../config/sendgrid");

exports.createMail = (req, res, next) => {
  const mail = new Mail(req.body);
  mail.save((err, hd) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      mail: hd,
    });
  });
};

exports.updateMail = async (req, res, next) => {
  try {
    const id = req.body._id;
    delete req.body._id;
    await Mail.findByIdAndUpdate(id, req.body);
    const mail = await Mail.findById(id);
    res.send({ mail });
  } catch (err) {
    return next(err);
  }
};

exports.listMailByOrg = (req, res, next) => {
  Mail.find({ organization: req.params.org_id }).exec((err, hds) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      mails: hds,
    });
  });
};

exports.listMailGlobal = (req, res, next) => {
  Mail.find({ organization: null }).exec((err, hds) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      mails: hds,
    });
  });
};

exports.deleteMail = (req, res, next) => {
  Mail.deleteOne({ _id: req.params.id }).exec((err, hd) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      mail: hd,
    });
  });
};

exports.addNewOrgMail = async (orgId) => {
  try {
    mails = await Mail.find({ organization: null });
    for (let mail of mails) {
      if (mail._doc.name === "Software Company Invite") continue;
      const nm = new Mail({
        name: mail._doc.name,
        content: mail._doc.content,
        organization: orgId,
      });
      await nm.save();
    }
  } catch (err) {
    return next(err);
  }
};

exports.sendTestMail = (req, res, next) => {
  const feedType = req.body.feedType;
  const comment = req.body.comment;
  sendgrid.sendFeedbackMail(feedType, comment);
  res.status(201).json({
    message: "success",
  });
};
