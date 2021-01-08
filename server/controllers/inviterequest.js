const InviteRequest = require("../models/inviterequest");

exports.createInviteRequest = (req, res, next) => {
  const ir = new InviteRequest(req.body);
  ir.save((err, result) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      inviteRequest: result,
    });
  });
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
