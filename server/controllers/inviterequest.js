const InviteRequest = require("../models/inviterequest");
const sendgrid = require("../config/sendgrid");

exports.createInviteRequest = async (req, res, next) => {
  try {
    let irs = await InviteRequest.find({ email: req.body.email });
    if (irs.length > 0) {
      return res
        .status(422)
        .send({ error: "That email address is already in use." });
    }
    const ir = new InviteRequest(req.body);
    result = await ir.save();
    sendgrid.inviteRequestMail(
      Object.assign(
        {
          admin_name: "David Fisher",
          admin_email: "dfisher@integraledger.com",
        },
        req.body
      )
    );
    sendgrid.inviteRequestMail(
      Object.assign(
        {
          admin_name: "Mike Rinow",
          admin_email: "mrinow@integraledger.com",
        },
        req.body
      )
    );
    res.status(201).json({
      inviteRequests: result,
    });
  } catch (err) {
    return next(err);
  }
};

exports.listInviteRequest = (req, res, next) => {
  InviteRequest.find({ resolved: false }).exec((err, irs) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      inviteRequests: irs,
    });
  });
};

exports.resolveInviteRequest = async (req, res, next) => {
  try {
    ir = await InviteRequest.findById(req.params.id);
    ir.resolved = true;
    ir.save();
    res.status(201).json({
      inviteRequest: ir,
    });
  } catch (err) {
    return next(err);
  }
};
