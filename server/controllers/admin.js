const User = require("../models/user");
const Project = require("../models/project");
const { ROLE_SUPER_ADMIN, ROLE_BLOCK } = require("../constants");
const setUserInfo = require("../helpers").setUserInfo;
const sendgrid = require("../config/sendgrid");

exports.listAdminUsers = async (req, res, next) => {
  try {
    let users = await User.find({ role: { $ne: ROLE_BLOCK } }).select(
      "_id email profile verified role"
    );
    return res.status(201).json({
      participants: users,
    });
  } catch (err) {
    return next(err);
  }
};

exports.listAdminProjectCreators = (req, res, next) => {
  Project.find({})
    .populate("participant")
    .select("_id email profile")
    .exec((err, participants) => {
      if (err) {
        return next(err);
      }
      let result = [];
      for (let pt of participants) {
        if (pt.participant) {
          result.push(pt);
        }
      }
      res.status(201).json({ participants: result });
    });
};

exports.updateRole = async (req, res, next) => {
  try {
    if (req.user.role !== ROLE_SUPER_ADMIN)
      return res.status(401).send({ error: "You are not super admin user" });
    await User.findByIdAndUpdate(req.params.id, {
      role: req.body.role,
    });
    let user = await User.findById(req.params.id);
    res.send({ user });
  } catch (err) {
    return next(err);
  }
};

exports.getAdminUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    const userToReturn = setUserInfo(user);
    return res.status(200).json({ user: userToReturn });
  } catch (err) {
    return next(err);
  }
};

exports.upateAdminUser = async (req, res, next) => {
  try {
    let profile = req.body.profile;
    let email = profile.email;
    if (!profile.org) profile.org = null;
    delete profile.email;
    delete profile._id;
    await User.findByIdAndUpdate(req.params.id, {
      profile,
      email,
    });
    let user = await User.findById(req.params.id);
    res.send({ user });
  } catch (err) {
    return next(err);
  }
};

exports.getAdminEmailTemplates = (req, res, next) => {
  try {
    let result = [];
    result.push({
      title: "Participant Email Verification",
      html: sendgrid.userEVFactory(
        "participant@mail.com",
        "Sergey Oleh",
        "e494a9ddff8488aa372df18cb884252d"
      ),
    });
    result.push({
      title: "Participant Reset Password",
      html: sendgrid.userFPFactory("e494a9ddff8488aa372df18cb884252d"),
    });
    result.push({
      title: "New Notification",
      html: sendgrid.notificationFactory(
        "Group Chat Invitation",
        "You are invited to team chat",
        "Mike",
        "https://hackathon-fourthsector.s3.us-east-2.amazonaws.com/a6d1e651-8198-46a4-a57d-669bd12ba96c.png"
      ),
    });
    result.push({
      title: "Invite Email",
      html: sendgrid.inviteFactory({
        first_name: "Sergey",
        last_name: "Rubezhin",
        email: "test@gmail.com",
        organization: "MYZ",
        creator: "Integra Team",
        content:
          '<p>​&nbsp;&nbsp;&nbsp;&nbsp;</p><p><span style="font-size: 16px;"><strong><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; touch-action: pan-x pan-y; vertical-align: 1.03333px; line-height: 0px; position: relative;">&nbsp;&nbsp;&nbsp;&nbsp;Congratulations</span></strong><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; touch-action: pan-x pan-y; vertical-align: 1.03333px; line-height: 0px; position: relative;">!&nbsp;</span></span></p><p><span style="font-size: 16px;"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; touch-action: pan-x pan-y; vertical-align: 1.03333px; line-height: 0px; position: relative;">&nbsp;&nbsp;&nbsp;&nbsp;You have just experienced blockchain “</span><strong><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; touch-action: pan-x pan-y; vertical-align: 1.03333px; line-height: 0px; position: relative;">smart document</span></strong><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; touch-action: pan-x pan-y; vertical-align: 1.03333px; line-height: 0px; position: relative;">” technology that&nbsp;allows &nbsp;&nbsp;&nbsp;&nbsp;ordinary documents to to processed automatically by almost any software.</span></span><strong></strong><br></p>',
      }),
    });
    return res.status(200).json({ templates: result });
  } catch (err) {
    return next(err);
  }
};
