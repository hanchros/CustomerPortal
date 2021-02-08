const Organization = require("../models/organization");
const sendgrid = require("../config/sendgrid");
const User = require("../models/user");
const ProjectOrg = require("../models/projectorg");
const ProjectMember = require("../models/projectmember");
const MailController = require("./mail");
const Timeline = require("../models/timeline");

exports.createOrganization = async (req, res, next) => {
  try {
    const project_id = req.body.project;
    delete req.body.project;
    const org = new Organization(req.body);
    const org_result = await org.save();
    const user = await User.findById(req.body.creator);
    user.profile.org = org_result._id;
    user.profile.org_role = "admin";
    user.save();
    if (project_id) {
      const po = new ProjectOrg({
        organization: org_result._id,
        project: project_id,
      });
      po.save();
      let tl = new Timeline({
        title: `Organization "${org_result.org_name}" was added to the project`,
        project: project_id,
      });
      await tl.save();
    }
    MailController.addNewOrgMail(org_result._id);
    res.status(201).json({
      organization: org_result,
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateOrganization = async (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  try {
    await Organization.findByIdAndUpdate(id, req.body);
    let org = await Organization.findById(id).populate({
      path: "creator",
      select: "_id profile",
    });
    res.status(201).json({
      organization: org,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getOrganization = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.org_id).populate({
      path: "creator",
      select: "_id profile",
    });
    res.status(201).json({
      organization: org,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getOrgByName = async (req, res, next) => {
  try {
    const org = await Organization.findOne({ org_name: req.params.org_name });
    res.status(201).json({
      organization: org,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getOrgUsers = async (req, res, next) => {
  try {
    const users = await User.find(
      { "profile.org": req.params.org_id },
      "_id email profile"
    );
    let results = [];
    for (let user of users) {
      const pms = await ProjectMember.find({ participant: user._id }).populate(
        "project"
      );
      results.push(Object.assign({ projects: pms }, user._doc));
    }
    res.status(201).json({ users: results });
  } catch (err) {
    return next(err);
  }
};

exports.removeUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user_id);
    user.profile.org = null;
    await user.save();
    res.status(201).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user_id);
    user.profile.org = req.body.orgId;
    await user.save();
    res.status(201).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

exports.changeUserOrgRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user_id);
    user.profile.org_role = req.body.org_role;
    await user.save();
    res.status(201).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

exports.sendInviteOrgMember = async (req, res, next) => {
  try {
    sendgrid.inviteOrgMemberMail(req.body);
    res.status(201).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

exports.acceptInviteOrgMember = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    user.profile.org = req.body.orgId;
    user.profile.org_name = req.body.org_name;
    user.profile.org_role = "member";
    await user.save();
    res.status(201).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

exports.listSimpleOrgs = async (req, res, next) => {
  let curNum = parseInt(req.params.count) || 0;
  try {
    let organizations = await Organization.find({})
      .sort("org_name")
      .select("_id, org_name")
      .skip(curNum);
    res.status(201).json({
      organizations: organizations,
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteOrganization = (req, res, next) => {
  Organization.deleteOne({ _id: req.params.org_id }).exec((err, org) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      organization: org,
    });
  });
};

exports.adminOrgReports = async (req, res, next) => {
  try {
    let organizations = await Organization.find({}).populate({
      path: "creator",
      select: "_id profile email",
    });
    let result = [];
    for (let org of organizations) {
      let members = await User.find(
        {
          "profile.org": org._id,
        },
        "_id profile email"
      );
      result.push(Object.assign({ members, id: org._id }, org._doc));
    }
    res.status(201).json({
      organizations: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.contactOrg = async (req, res, next) => {
  try {
    let org = await Organization.findById(req.params.id);
    if (!org) {
      return res
        .status(400)
        .json({ message: "Failed to send contact information" });
    }
    sendgrid.newContactProject(
      org.contact_email,
      req.body.email,
      req.body.phone,
      req.body.message,
      req.body.gallery
    );
    res.status(201).json({ message: "Contact submitted successfully" });
  } catch (err) {
    return next(err);
  }
};

exports.getInviteMailTemplate = (req, res, next) => {
  try {
    let result = {
      title: "Invite Email",
      html: sendgrid.inviteOrgMemberFactory(req.body),
    };
    return res.status(200).json({ mail: result });
  } catch (err) {
    return next(err);
  }
};
