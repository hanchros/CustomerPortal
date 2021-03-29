const User = require("../models/user");
const setUserInfo = require("../helpers").setUserInfo;
const ProjectMember = require("../models/projectmember");
const SoftCompany = require("../models/softcompany");

//= =======================================
// User Routes
//= =======================================
exports.viewProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, "_id email profile").populate({
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
    if (user) {
      const userToReturn = setUserInfo(user);
      return res.status(200).json({ user: userToReturn });
    }
    let softcompany = await SoftCompany.findById(
      req.user._id,
      "_id email profile"
    );
    return res.status(200).json({ softcompany });
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
    return next(err);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    let user = await User.deleteOne({ _id: req.params.userId });
    await ProjectMember.deleteMany({ participant: req.params.userId });
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
};

exports.getUserByEmail = async (req, res, next) => {
  try {
    let user = await User.findOne(
      { email: req.body.email },
      "_id profile"
    ).populate("profile.org");
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
