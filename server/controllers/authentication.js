const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const sendgrid = require("../config/sendgrid");
const setUserInfo = require("../helpers").setUserInfo;
const getRole = require("../helpers").getRole;
const config = require("../config/main");
const Token = require("../models/token");
const Organization = require("../models/organization");
const ProjectMember = require("../models/projectmember");
const Timeline = require("../models/timeline");
const SoftCompany = require("../models/softcompany");

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800, // in seconds
  });
}

//= =======================================
// Login Route
//= =======================================
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    let user = await User.findOne({ email }).populate({
      path: "profile.org",
      populate: {
        path: "creator",
        select: "_id profile",
      },
    });
    if (user) {
      user.comparePassword(password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).json({ error: "Password mismatch" });
        }
        const userInfo = setUserInfo(user);
        if (!userInfo.verified) {
          return res
            .status(422)
            .send({ error: "Your account is not verified yet" });
        }
        let result = {
          token: `JWT ${generateToken(userInfo)}`,
          user: userInfo,
        };
        if (getRole(userInfo.role) === 3) {
          return res
            .status(422)
            .send({ error: "Your account is not authorized" });
        }
        return res.status(200).json(result);
      });
    } else {
      // check software company
      let softcompany = await SoftCompany.findOne({ email });
      if (!softcompany) {
        return res
          .status(401)
          .json({ error: "No user or software company with the email" });
      }
      softcompany.comparePassword(password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).json({ error: "Password mismatch" });
        }
        let result = {
          token: `JWT ${generateToken({
            _id: softcompany._id,
            org_name: softcompany.profile.org_name,
            email: softcompany.email,
            contact: softcompany.profile.contact,
          })}`,
          softcompany,
        };
        return res.status(200).json(result);
      });
    }
  } catch (err) {
    return next(err);
  }
};

//= =======================================
// Registration Route
//= =======================================
exports.participantRegister = async function (req, res, next) {
  const email = req.body.email;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const password = req.body.password;

  try {
    let users = await User.find({ email });
    if (users.length > 0) {
      return res
        .status(422)
        .send({ error: "That email address is already in use." });
    }
    const user = new User({
      email,
      password,
      profile: { first_name, last_name },
      verified: false,
    });
    const usr = await user.save();
    const userInfo = setUserInfo(usr);
    const token = new Token({
      _userId: userInfo._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    token.save();
    sendgrid.userEmailVerification(
      userInfo.email,
      `${userInfo.profile.first_name} ${userInfo.profile.last_name} `,
      token.token
    );
    return res.status(201).json({ user: userInfo });
  } catch (err) {
    return next(err);
  }
};

exports.inviteRegister = async function (req, res, next) {
  const email = req.body.email;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const password = req.body.password;
  const org_name = req.body.organization || "";
  const photo = req.body.photo;
  const phone = req.body.phone;
  const project_id = req.body.project_id;
  const project_role = req.body.project_role;
  const role = req.body.role;

  try {
    let users = await User.find({ email });
    let scs = await SoftCompany.find({ email });
    if (scs.length > 0 || users.length > 0) {
      return res
        .status(422)
        .send({ error: "That email address is already in use." });
    }
    const orgEx = await Organization.findOne({ org_name });
    const org = orgEx ? orgEx._id : null;
    const user = new User({
      email,
      password,
      profile: { first_name, last_name, org, org_name, photo, phone, role },
      verified: true,
    });
    const usr = await user.save();
    const userInfo = setUserInfo(usr);
    if (project_id) {
      const pm = new ProjectMember({
        participant: usr._id,
        project: project_id,
        role: project_role || "member",
      });
      pm.save();
      const timeline = new Timeline({
        title: `${first_name} ${last_name} was invited to the project`,
        project: project_id,
      });
      timeline.save();
    }
    return res.status(201).json({ user: userInfo });
  } catch (err) {
    return next(err);
  }
};

exports.confirmEmail = async (req, res, next) => {
  const { token } = req.body;
  try {
    const t = await Token.findOne({ token });
    if (!t) {
      res.status(201).json({
        message: "Invalid token for email verification",
      });
      return;
    }
    let result = await User.findById(t._userId);

    if (!result) {
      res.status(201).json({
        message: "Invalid token for email verification",
      });
      return;
    }
    if (result.verified) {
      res.status(201).json({
        message: "The account has already been verified",
      });
      return;
    }
    result.verified = true;
    result.save();
    res.status(201).json({
      message: "The account has been verified successfully",
    });
  } catch (err) {
    return next(err);
  }
};

//= =======================================
// Authorization Middleware
//= =======================================

// Role authorization check
exports.roleAuthorization = function (requiredRole) {
  return function (req, res, next) {
    const user = req.user;

    User.findById(user._id, (err, foundUser) => {
      if (err) {
        res.status(422).json({ error: "No user was found." });
        return next(err);
      }

      // If user is found, check role.
      if (getRole(foundUser.role) >= getRole(requiredRole)) {
        return next();
      }

      return res
        .status(401)
        .json({ error: "You are not authorized to view this content." });
    });
  };
};

//= =======================================
// Forgot Password Route
//= =======================================

exports.forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  try {
    let user = await User.findOne({ email });
    if (user) {
      let token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      token = await token.save();
      sendgrid.userForgotPasword(email, token.token);
      return res.status(200).json({
        message: "Please check your email for the link to reset your password.",
      });
    }
    let softcompany = await SoftCompany.findOne({ email });
    if (softcompany) {
      let token = new Token({
        _userId: softcompany._id,
        token: crypto.randomBytes(16).toString("hex"),
        mode: "organization",
      });
      token = await token.save();
      sendgrid.userForgotPasword(email, token.token);
      return res.status(200).json({
        message: "Please check your email for the link to reset your password.",
      });
    }
    return res.status(422).json({
      error:
        "Your request could not be processed with the email. Please try again.",
    });
  } catch (err) {
    return next(err);
  }
};

//= =======================================
// Reset Password Route
//= =======================================

exports.verifyToken = function (req, res, next) {
  Token.findOne({ token: req.params.token }, (err, token) => {
    if (err || !token) {
      return res.status(422).json({
        error:
          "Your token has expired. Please attempt to reset your password again.",
      });
    }
    if (token.mode === "organization") {
      SoftCompany.findById(token._userId, (err, softcompany) => {
        if (err) {
          return next(err);
        }
        softcompany.password = req.body.password;
        softcompany.save((err) => {
          if (err) {
            return next(err);
          } else {
            return res.status(200).json({
              message:
                "Password changed successfully. Please login with your new password.",
            });
          }
        });
      });
    } else {
      User.findById(token._userId, (err, user) => {
        if (err) {
          return next(err);
        }
        user.password = req.body.password;
        user.save((err) => {
          if (err) {
            return next(err);
          } else {
            return res.status(200).json({
              message:
                "Password changed successfully. Please login with your new password.",
            });
          }
        });
      });
    }
  });
};

exports.resetPasswordSecurity = async (req, res, next) => {
  try {
    let user = await User.findById(req.body.userid);
    user.password = req.body.password;
    await user.save();
    return res.status(200).json({
      message:
        "Password changed successfully. Please login with your new password.",
    });
  } catch (err) {
    return next(err);
  }
};

exports.resendVerification = function (req, res, next) {
  const { _id, email, mode, name } = req.body;
  var token = new Token({
    _userId: _id,
    token: crypto.randomBytes(16).toString("hex"),
    mode,
  });
  token.save(function (err) {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    sendgrid.userEmailVerification(email, name, token.token);
  });
};

exports.changePassword = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    user.comparePassword(req.body.oldPassword, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: "Password mismatch" });
      }
      user.password = req.body.newPassword;
      user.save();
      return res.status(200).json({ message: "success" });
    });
  } catch (err) {
    return next(err);
  }
};

exports.changeCompanyPassword = async (req, res, next) => {
  try {
    let softcompany = await SoftCompany.findById(req.user._id);
    softcompany.comparePassword(req.body.oldPassword, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: "Password mismatch" });
      }
      softcompany.password = req.body.newPassword;
      softcompany.save();
      return res.status(200).json({ message: "success" });
    });
  } catch (err) {
    return next(err);
  }
};
