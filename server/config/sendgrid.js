const config = require("./main");
const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const fs = require("fs");

sgMail.setApiKey(config.sendgridApiKey);
const mainURL = "https://integrationcenter.z14.web.core.windows.net";

exports.userEmailVerification = function userEmailVerification(
  recipient,
  name,
  token
) {
  const msg = {
    to: recipient,
    from: "events@dev.com",
    subject: "Participant Email Verification",
    html: userEVFactory(recipient, name, token),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.userForgotPasword = function userForgotPasword(recipient, token) {
  const msg = {
    to: recipient,
    from: "events@dev.com",
    subject: "Participant Reset Password",
    html: userFPFactory(token),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.newNotification = function newNotification(
  email,
  title,
  content,
  senderName,
  senderPhoto
) {
  const msg = {
    to: email,
    from: "events@dev.com",
    subject: senderName,
    html: notificationFactory(title, content, senderName, senderPhoto),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.inviteMail = function inviteMail(values) {
  const msg = {
    to: values.email,
    from: "events@dev.com",
    subject: "You are invited",
    html: inviteFactory(values),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

function userEVFactory(recipient, name, token) {
  const link = `${mainURL}/email-verify/user/${token}`;
  const mailData = { recipient, name, link };
  const template = fs.readFileSync("template/UserEV.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function userFPFactory(token) {
  const link = `${mainURL}/reset-password/user/${token}`;
  const mailData = { link };
  const template = fs.readFileSync("template/UserFP.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function notificationFactory(title, content, senderName, senderPhoto) {
  const mailData = { title, content, senderName, senderPhoto };
  const template = fs.readFileSync("template/Notification.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function inviteFactory(values) {
  const link = `${mainURL}/email-invite`;
  const mailData = Object.assign(values, { link });
  const template = fs.readFileSync("template/Invite.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

exports.userEVFactory = userEVFactory;
exports.userFPFactory = userFPFactory;
exports.notificationFactory = notificationFactory;
exports.inviteFactory = inviteFactory;
