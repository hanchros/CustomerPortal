const User = require("../models/user");
const setUserInfo = require("../helpers").setUserInfo;
const Project = require("../models/project");
const ProjectMember = require("../models/projectmember");

//= =======================================
// User Routes
//= =======================================
exports.viewProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = User.findById(userId, "_id profile").populate({
      path: "profile.org",
      populate: {
        path: "creator",
        select: "_id profile",
      },
    });
    if (!user) {
      res.status(400).json({ error: "No user could be found for this ID." });
      return next(err);
    }
    const userToReturn = setUserInfo(user);
    return res.status(200).json({ user: userToReturn });
  } catch (err) {
    return next(err);
  }
};

exports.getUserSession = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id).populate({
      path: "profile.org",
      populate: {
        path: "creator",
        select: "_id profile",
      },
    });
    const userToReturn = setUserInfo(user);
    return res.status(200).json({ user: userToReturn });
  } catch (err) {
    return next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    let profile = req.body.profile;
    let email = profile.email;
    if (!profile.org) profile.org = null;
    delete profile.email;
    await User.findByIdAndUpdate(req.user._id, {
      profile,
      email,
    });
    let user = await User.findById(req.user._id).populate({
      path: "profile.org",
      populate: {
        path: "creator",
        select: "_id profile",
      },
    });
    res.send({ user });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

exports.deleteProfile = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId }).exec((err, user) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      user,
    });
  });
};

exports.getUserByEmail = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email }, "_id profile");
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
};

exports.orgUsers = (req, res, next) => {
  User.find({ "profile.org": req.params.org_id }, "_id profile")
    .select.sort({ createdAt: "desc" })
    .exec((err, users) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        participants: users,
      });
    });
};

exports.listAllUsers = async (req, res, next) => {
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
    if (tags.length > 0) filter["profile.tags"] = { $all: tags };
    if (searchStr.length > 2)
      filter["$or"] = [
        { "profile.first_name": { $regex: searchStr, $options: "i" } },
        { "profile.last_name": { $regex: searchStr, $options: "i" } },
        { "profile.org_name": { $regex: searchStr, $options: "i" } },
        { "profile.country": { $regex: searchStr, $options: "i" } },
        { "profile.personal_statement": { $regex: searchStr, $options: "i" } },
        { "profile.role": { $regex: searchStr, $options: "i" } },
      ];
    let sort = { createdAt: -1 };
    switch (sortFilter) {
      case "A-Z":
        sort = { "profile.first_name": 1 };
        break;
      case "Z-A":
        sort = { "profile.first_name": -1 };
        break;
      case "Oldest-Newest":
        sort = { createdAt: 1 };
        break;
      default:
        sort = sort;
    }

    let total = await User.find(filter).countDocuments();
    let users = await User.find(filter, "_id profile")
      .sort(sort)
      .skip(curNum)
      .limit(16);
    let result = [];
    for (let user of users) {
      let proj_count = await Project.where({
        participant: user._id,
      }).countDocuments();
      let pm_count = await ProjectMember.where({
        participant: user._id,
      }).countDocuments();
      let newUser = {
        ...user,
        projects: proj_count + pm_count,
      };
      result.push(newUser);
    }
    return res.status(201).json({
      participants: result,
      total,
    });
  } catch (err) {
    return next(err);
  }
};

exports.listSimpleParticipants = async (req, res, next) => {
  try {
    let users = await User.find({}, "_id profile");
    return res.status(201).json({
      participants: users,
    });
  } catch (err) {
    return next(err);
  }
};

exports.adminListUnverifiedParticipants = async (req, res, next) => {
  try {
    let users = await User.find(
      { verified: { $ne: true } },
      "_id profile email"
    );
    return res.status(201).json({
      participants: users,
    });
  } catch (err) {
    return next(err);
  }
};

exports.adminVerifyParticipant = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      verified: true,
    });
    let user = await User.findById(req.params.id);
    res.send({ user });
  } catch (err) {
    return next(err);
  }
};
