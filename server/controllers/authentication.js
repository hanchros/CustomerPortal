const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const sendgrid = require("../config/sendgrid");
const setUserInfo = require("../helpers").setUserInfo;
const getRole = require("../helpers").getRole;
const config = require("../config/main");
const Token = require("../models/token");
const Organization = require("../models/organization");

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
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "No user with the email" });
    }
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
  const usertype = req.body.usertype;

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
      usertype,
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
    if (mode === "organization") {
      sendgrid.orgEmailVerification(email, name, token.token);
    } else {
      sendgrid.userEmailVerification(email, name, token.token);
    }
  });
};

exports.sendInvite = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.body.organization);
    const values = Object.assign(req.body, {
      organization: org.org_name,
      creator: `${req.user.profile.first_name} ${req.user.profile.last_name}`,
    });
    sendgrid.inviteMail(values);
    const result = sendgrid.inviteFactory(values);
    return res.status(200).json({
      content: result,
    });
  } catch (err) {
    return next(err);
  }
};
