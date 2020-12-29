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

exports.orgEmailVerification = function orgEmailVerification(
  recipient,
  name,
  token
) {
  const msg = {
    to: recipient,
    from: "events@dev.com",
    subject: "Organization Email Verification",
    html: orgEVFactory(recipient, name, token),
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

exports.orgForgotPasword = function orgForgotPasword(recipient, token) {
  const msg = {
    to: recipient,
    from: "events@dev.com",
    subject: "Organization Reset Password",
    html: orgFPFactory(token),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.newMessage = function newMessage(name, sender, content, email) {
  const msg = {
    to: email,
    from: "events@dev.com",
    subject: "You have unread messages",
    html: messageFactory(name, sender, content),
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

exports.newContactProject = function newContactProject(
  toEmail,
  fromEmail,
  phone,
  content,
  gallery
) {
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: "New Contact",
    html: galleryContactFactory(phone, content, gallery),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.challegeCreateMail = function challegeCreateMail(org, challenge) {
  if (!org.authorized_email) return;
  const msg = {
    to: org.authorized_email,
    from: "events@dev.com",
    subject: "New Challenge Created",
    html: createCHLFactory(org, challenge),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.inviteMail = function inviteMail(recipient, filename) {
  pathToAttachment = `${__dirname}/../uploads/${filename}`;
  attachment = fs.readFileSync(pathToAttachment).toString("base64");

  const msg = {
    to: recipient,
    from: "events@dev.com",
    subject: "You are invited",
    html: inviteFactory(),
    attachments: [
      {
        content: attachment,
        filename: filename,
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
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

function orgEVFactory(recipient, name, token) {
  const link = `${mainURL}/email-verify/organization/${token}`;
  const mailData = { recipient, name, link };
  const template = fs.readFileSync("template/OrgEV.html", {
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

function orgFPFactory(token) {
  const link = `${mainURL}/reset-password/organization/${token}`;
  const mailData = { link };
  const template = fs.readFileSync("template/OrgFP.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function messageFactory(name, sender, content) {
  const mailData = { name, sender, content };
  const template = fs.readFileSync("template/Message.html", {
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

function galleryContactFactory(phone, content, gallery) {
  const mailData = { phone, content, gallery };
  const template = fs.readFileSync("template/GalleryContact.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function createCHLFactory(org, challenge) {
  // const link = `${mainURL}/email-verify/user/${token}`;
  const mailData = {
    org: org.org_name,
    name: challenge.challenge_name,
    description: challenge.short_description,
  };
  const template = fs.readFileSync("template/CreateChallenge.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function inviteFactory() {
  const link = `${mainURL}/register-form`;
  const mailData = { link };
  const template = fs.readFileSync("template/Invite.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

exports.userEVFactory = userEVFactory;
exports.orgEVFactory = orgEVFactory;
exports.userFPFactory = userFPFactory;
exports.createCHLFactory = createCHLFactory;
exports.orgFPFactory = orgFPFactory;
exports.messageFactory = messageFactory;
exports.notificationFactory = notificationFactory;
exports.galleryContactFactory = galleryContactFactory;
exports.inviteFactory = inviteFactory;
