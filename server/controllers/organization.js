const Organization = require("../models/organization");
const crypto = require("crypto");
const setOrgInfo = require("../helpers").setOrgInfo;
const sendgrid = require("../config/sendgrid");
const Token = require("../models/token");
const User = require("../models/user");
const Challenge = require("../models/challenge");
const Project = require("../models/project");

exports.updateOrganization = async (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  try {
    await Organization.findByIdAndUpdate(id, req.body);
    let org = await Organization.findById(id);
    let orgInfo = setOrgInfo(org);
    res.status(201).json({
      organization: orgInfo,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getOrganization = (req, res, next) => {
  Organization.findById(req.params.org_id, (err, org) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      organization: org,
    });
  });
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
      .select("_id authorized_email org_name")
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

exports.forgotPassword = function (req, res, next) {
  const email = req.body.email;

  Organization.findOne({ authorized_email: email }, (err, existingOrg) => {
    // If user is not found, return error
    if (err || existingOrg == null) {
      res.status(422).json({
        error:
          "Your request could not be processed with the email. Please try again.",
      });
      return next(err);
    }

    // If user is found, generate and save resetToken
    var token = new Token({
      _userId: existingOrg._id,
      token: crypto.randomBytes(16).toString("hex"),
      mode: "organization",
    });

    token.save((err) => {
      // If error in saving token, return it
      if (err) {
        return next(err);
      }

      sendgrid.orgForgotPasword(email, token.token);

      return res.status(200).json({
        message: "Please check your email for the link to reset your password.",
      });
    });
  });
};

exports.adminOrgReports = async (req, res, next) => {
  try {
    let organizations = await Organization.find({});
    let result = [];
    for (let org of organizations) {
      let members = await User.where({
        "profile.org": org._id,
      }).countDocuments();
      let challenges = await Challenge.find({ organization: org._id });
      let projects = 0;
      for (let chl of challenges) {
        let ps = await Project.where({ challenge: chl._id }).countDocuments();
        projects += ps;
      }

      let newOrg = {
        id: org._id,
        logo: org._doc.logo,
        name: org._doc.org_name,
        authroized_email: org._doc.authorized_email,
        contact_email: org._doc.contact_email,
        participants: members,
        challenges: challenges.length,
        projects,
      };
      result.push(newOrg);
    }
    res.status(201).json({
      organizations: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.adminOrgWithUsers = async (req, res, next) => {
  try {
    let organizations = await Organization.find({});
    let result = [];
    for (let org of organizations) {
      let users = await User.where({ "profile.org": org._id }).select(
        "_id profile email"
      );
      if (!users) users = [];
      let newOrg = {
        id: org._id,
        name: org._doc.org_name,
        authroized_email: org._doc.authorized_email,
        contact_email: org._doc.contact_email,
        participants: users,
      };
      result.push(newOrg);
    }
    result.sort((a, b) => {
      if (a.participants.length < b.participants.length) return 1;
      if (a.participants.length > b.participants.length) return -1;
      return 0;
    });
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

exports.adminListUnverifiedOrganizations = async (req, res, next) => {
  try {
    let organizations = await Organization.find({ verified: { $ne: true} });
    return res.status(201).json({
      organizations,
    });
  } catch (err) {
    return next(err);
  }
};

exports.adminVerifyOrganization = async (req, res, next) => {
  try {
    await Organization.findByIdAndUpdate(req.params.id, {
      verified: true,
    });
    let organization = await Organization.findById(req.params.id);
    res.send({ organization });
  } catch (err) {
    return next(err);
  }
};
