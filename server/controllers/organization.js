const Organization = require("../models/organization");
const sendgrid = require("../config/sendgrid");
const User = require("../models/user");
const ProjectOrg = require("../models/projectorg");
const ProjectMember = require("../models/projectmember");

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
    }
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

exports.listOrganization = async (req, res, next) => {
  let curNum = parseInt(req.params.count) || 0;
  try {
    let sortFilter = req.body.filter_sort || "";
    let searchStr = req.body.searchStr || "";
    delete req.body.loading;
    delete req.body.searchStr;
    delete req.body.filter_sort;

    let filter = {};
    let tags = [];
    for (let k of Object.keys(req.body)) {
      if (req.body[k] && req.body[k].length > 0) {
        tags = [...tags, ...req.body[k]];
      }
    }
    if (tags.length > 0) filter["tags"] = { $all: tags };
    if (searchStr.length > 2)
      filter["$or"] = [
        { org_name: { $regex: searchStr, $options: "i" } },
        { org_type: { $regex: searchStr, $options: "i" } },
        { country: { $regex: searchStr, $options: "i" } },
      ];
    let sort = { createdAt: -1 };
    switch (sortFilter) {
      case "A-Z":
        sort = { org_name: 1 };
        break;
      case "Z-A":
        sort = { org_name: -1 };
        break;
      case "Oldest-Newest":
        sort = { createdAt: 1 };
        break;
      default:
        sort = sort;
    }

    let total = await Organization.find(filter).countDocuments();
    let organizations = await Organization.find(filter)
      .sort(sort)
      .skip(curNum)
      .limit(16);
    let result = [];
    for (let org of organizations) {
      let count = await User.where({ "profile.org": org._id }).countDocuments();
      let newOrg = { ...org._doc, participants: count };
      result.push(newOrg);
    }
    res.status(201).json({
      organizations: result,
      total: total,
    });
  } catch (error) {
    return next(error);
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
      select: "_id profile",
    });
    let result = [];
    for (let org of organizations) {
      let members = await User.find({
        "profile.org": org._id,
      }, "_id profile");
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
