const Organization = require("../models/organization");
const sendgrid = require("../config/sendgrid");
const User = require("../models/user");

exports.createOrganization = async (req, res, next) => {
  try {
    const org = new Organization(req.body);
    let org_result = await org.save();
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
    let org = await Organization.findById(id);
    res.status(201).json({
      organization: org,
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
    let organizations = await Organization.find({});
    let result = [];
    for (let org of organizations) {
      let members = await User.where({
        "profile.org": org._id,
      }).countDocuments();
      let newOrg = {
        id: org._id,
        logo: org._doc.logo,
        org_name: org._doc.org_name,
        participants: members,
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
        org_name: org._doc.org_name,
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
