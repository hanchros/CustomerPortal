const config = require("./config/main"),
  mongoose = require("mongoose");
const Faq = require("./models/faq");
const Article = require("./models/article");
const User = require("./models/user");
const Project = require("./models/project");
const Token = require("./models/token");
const Organization = require("./models/organization");
const ProjectMember = require("./models/projectmember");
const Timeline = require("./models/timeline");
const Conversation = require("./models/conversation");
const Message = require("./models/message");
const Comment = require("./models/comment");
const Invite = require("./models/invite");
const Notification = require("./models/notification");
const ProjectOrg = require("./models/projectorg");
const Template = require("./models/template");
const Mail = require("./models/mail");
const Technology = require("./models/technology");
const SoftCompany = require("./models/softcompany");
const ProjectCompany = require("./models/projectcompany");

const ROLE_SUPER_ADMIN = require("./constants").ROLE_SUPER_ADMIN;

const main = async () => {
  try {
    // Database Setup
    await mongoose.connect(config.database, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await cleanModels();
    await createInitUser();
  } catch (err) {
    console.log(err);
  }
  console.log("finished");
  process.exit();
};

const cleanModels = async () => {
  await Faq.deleteMany({});
  await User.deleteMany({});
  await Project.deleteMany({});
  await Token.deleteMany({});
  await Organization.deleteMany({});
  await ProjectMember.deleteMany({});
  await Timeline.deleteMany({});
  await Conversation.deleteMany({});
  await Message.deleteMany({});
  await Comment.deleteMany({});
  await Invite.deleteMany({});
  await Notification.deleteMany({});
  await ProjectOrg.deleteMany({});
  await Template.deleteMany({});
  await Technology.deleteMany({});
  await SoftCompany.deleteMany({});
  await ProjectCompany.deleteMany({});
  await Article.deleteMany({ organization: { $ne: null } });
  await Mail.deleteMany({ organization: { $ne: null } });
};

const createInitUser = async () => {
  const email = "collaboration@integraledger.com";
  const first_name = "Integra";
  const last_name = "Ledger";
  const password = "MikeRinow1!";
  try {
    let user = new User({
      email,
      password,
      profile: { first_name, last_name },
      role: ROLE_SUPER_ADMIN,
      verified: true,
    });
    user = await user.save();
    let org = new Organization({
      org_name: "Integra",
      org_type: "Corporation",
      location: "united state",
      creator: user._id,
    });
    org = await org.save();
    user.profile.org = org._id;
    user.profile.org_name = org.org_name;
    user.profile.org_role = "admin";
    user.profile.role = "Operations";
    await user.save();
    mails = await Mail.find({ organization: null });
    for (let mail of mails) {
      if (mail._doc.name === "Software Company Invite") continue;
      const nm = new Mail({
        name: mail._doc.name,
        content: mail._doc.content,
        organization: org._id,
      });
      await nm.save();
    }
  } catch (err) {
    console.log(err);
  }
};

main();
