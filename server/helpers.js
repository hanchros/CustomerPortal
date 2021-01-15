const ROLE_MEMBER = require("./constants").ROLE_MEMBER;
const ROLE_BLOCK = require("./constants").ROLE_BLOCK;
const ROLE_RESTRICT = require("./constants").ROLE_RESTRICT;
const ROLE_ADMIN = require("./constants").ROLE_ADMIN;
const crypto = require('crypto');
const iv = "1287cfd558f2523d00f12ba343e99c73";

// Set user info from request
exports.setUserInfo = function setUserInfo(request) {
  return {
    _id: request._id,
    profile: request.profile,
    email: request.email,
    role: request.role,
    verified: request.verified,
  };
};

exports.getRole = function getRole(checkRole) {
  let role;

  switch (checkRole) {
    case ROLE_ADMIN:
      role = 4;
      break;
    case ROLE_BLOCK:
      role = 3;
      break;
    case ROLE_RESTRICT:
      role = 2;
      break;
    case ROLE_MEMBER:
      role = 1;
      break;
    default:
      role = 1;
  }

  return role;
};

exports.translateP = function translateP(pstr) {
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(iv), Buffer.from(iv, "hex"));
  let encrypted = cipher.update(pstr);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}