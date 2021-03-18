const config = require("./main");
const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const fs = require("fs");

sgMail.setApiKey(config.sendgridApiKey);
const mainURL = "https://www.collaborate.app";

exports.userEmailVerification = function userEmailVerification(
  recipient,
  name,
  token
) {
  const msg = {
    to: recipient,
    from: "support@collaboration.app",
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
    from: "support@collaboration.app",
    subject: "Participant Reset Password",
    html: userFPFactory(token),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.newMessage = function newMessage(name, sender, content, email) {
  const msg = {
    to: email,
    from: "support@collaboration.app",
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
    from: "support@collaboration.app",
    subject: senderName,
    html: notificationFactory(title, content, senderName, senderPhoto),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.inviteMail = function inviteMail(values, filename) {
  pathToAttachment = `${__dirname}/../uploads/${filename}`;
  attachment = fs.readFileSync(pathToAttachment).toString("base64");

  const msg = {
    to: values.email,
    from: "support@collaboration.app",
    subject: "You are invited",
    html: inviteFactory(values),
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

exports.inviteOrgMemberMail = function inviteOrgMemberMail(values) {
  const msg = {
    to: values.email,
    from: "support@collaboration.app",
    subject: "You are invited",
    html: inviteOrgMemberFactory(values),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.inviteRequestMail = function inviteRequestMail(values) {
  const msg = {
    to: values.admin_email,
    from: "support@collaboration.app",
    subject: "New Request for Invite",
    html: inviteRequestFactory(values),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.joinProjectMail = function joinProjectMail(values) {
  const msg = {
    to: values.email,
    from: "support@collaboration.app",
    subject: "You are invited",
    html: joinProjectMailFactory(values),
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

function inviteFactory(values) {
  const link = `${mainURL}/${encodeURIComponent(
    values.sender_organization
  )}/email-invite?project=${encodeURIComponent(values.project_name)}`;
  const mailData = Object.assign(values, { link });
  let template = fs.readFileSync("template/OrgInvite.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function inviteOrgMemberFactory(values) {
  const link = `${mainURL}/org-invite/${values.org_id}/${values.encode_email}?fn=${values.first_name}&ln=${values.last_name}&role=${values.role}`;
  const mailData = Object.assign(values, { link });
  const template = fs.readFileSync("template/OrgMemberInvite.html", {
    encoding: "utf-8",
  });

  var text = ejs.render(template, mailData);
  return text;
}

function inviteRequestFactory(values) {
  const template = fs.readFileSync("template/InviteRequest.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, values);
  return text;
}

function joinProjectMailFactory(values) {
  const template = fs.readFileSync("template/OrgInvite.html", {
    encoding: "utf-8",
  });
  const mailData = Object.assign(values, { link: mainURL });
  var text = ejs.render(template, mailData);
  return text;
}

exports.sendFeedbackMail = function sendFeedbackMail(freeType, comment) {
  const subject = freeType === "report" ? "Bug found" : "Feedback given";
  const msg = {
    to: "contact.mozias@gmail.com",
    from: {
      email: "mail@mozaicalist.com",
      name: "mozaicalist.com",
    },
    subject,
    html: `<h3>${subject}</h3><strong>${comment}</strong>`,
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.userEVFactory = userEVFactory;
exports.userFPFactory = userFPFactory;
exports.messageFactory = messageFactory;
exports.notificationFactory = notificationFactory;
exports.inviteFactory = inviteFactory;
exports.inviteOrgMemberFactory = inviteOrgMemberFactory;
exports.mainURL = mainURL;
