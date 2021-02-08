const AuthenticationController = require("./controllers/authentication");
const UserController = require("./controllers/user");
const OrganizationController = require("./controllers/organization");
const FieldDataController = require("./controllers/fielddata");
const ProjectController = require("./controllers/project");
const ProjectMemberController = require("./controllers/projectmember");
const ProjectOrgController = require("./controllers/projectorg");
const CommentController = require("./controllers/comment");
const AdminController = require("./controllers/admin");
const NotificationController = require("./controllers/notification");
const ArticleController = require("./controllers/article");
const InviteRequestController = require("./controllers/inviterequest")
const TemplateController = require("./controllers/template");
const MailController = require("./controllers/mail");
const FaqController = require("./controllers/faq");
const ChatController = require("./controllers/chat");
const TimelineController = require("./controllers/timeline");

var multer  = require('multer')
const express = require("express");
const passport = require("passport");

const passportService = require("./config/passport");

// Middleware to require login/auth
const requireAuth = passport.authenticate("jwt", { session: false });
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({storage: storage})

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router(),
    organizationRoutes = express.Router(),
    projectRoutes = express.Router(),
    projectMemberRoutes = express.Router(),
    projectOrgRoutes = express.Router(),
    commentRoutes = express.Router(),
    adminRoutes = express.Router(),
    notificationRoutes = express.Router(),
    articleRoutes = express.Router(),
    inviteRequestRoutes = express.Router(),
    templateRoutes = express.Router(),
    mailRoutes = express.Router(),
    faqRoutes = express.Router(),
    chatRoutes = express.Router(),
    timelineRoutes = express.Router(),
    fieldDataRoutes = express.Router();


  //= ========================
  // Auth Routes
  //= ========================
  apiRoutes.use("/auth", authRoutes);
  // Participant Registration route
  authRoutes.post("/user-register", AuthenticationController.participantRegister);
  // Participant Registration by invite route
  authRoutes.post("/invite-register", AuthenticationController.inviteRegister);
  // Login route
  authRoutes.post("/login", AuthenticationController.login);
  // Password reset request route (generate/send token)
  authRoutes.post("/forgot-password", AuthenticationController.forgotPassword);
  // Password reset route (change password using token)
  authRoutes.post(
    "/reset-password/:token",
    AuthenticationController.verifyToken
  );
  // Password reset route (change password using security question)
  authRoutes.post(
    "/reset-password-security",
    AuthenticationController.resetPasswordSecurity
  );
  // Verify route
  authRoutes.post("/verify", AuthenticationController.confirmEmail);
  // Resend verification route
  authRoutes.post("/resend", AuthenticationController.resendVerification);


  //= ========================
  // User Routes
  //= ========================
  apiRoutes.use("/user", userRoutes);
  // View user profile route
  userRoutes.get("/:userId", UserController.viewProfile);
  // delete user route
  userRoutes.delete("/:userId", requireAuth, UserController.deleteProfile);
  // Update user profile route
  userRoutes.post("/", requireAuth, UserController.updateProfile);
  //Get All user profile route
  userRoutes.post("/list/:count", requireAuth, UserController.listAllUsers);
  // Test protected route
  apiRoutes.get("/protected", requireAuth, UserController.getUserSession);

  // Get Users associated with organizations route
  userRoutes.get("/users/:org_id", requireAuth, UserController.orgUsers)
  // All user route
  userRoutes.get("/simple-user/list", requireAuth, UserController.listSimpleParticipants);
  // All Unverified participant route
  userRoutes.get("/unverified/list", requireAuth, UserController.adminListUnverifiedParticipants);
  // Verify user profile route
  userRoutes.post("/unverified/:id", requireAuth, UserController.adminVerifyParticipant);
  // Get User by email route
  userRoutes.post("/email/check", UserController.getUserByEmail);


  //= ========================
  // Organization Routes
  //= ========================
  apiRoutes.use("/organization", organizationRoutes);
  // Create organization route
  organizationRoutes.post("/", OrganizationController.createOrganization);
  // Get organization route
  organizationRoutes.get("/:org_id", OrganizationController.getOrganization);
  // Update organization route
  organizationRoutes.put("/", OrganizationController.updateOrganization);
  // List organization user route
  organizationRoutes.get("/users/:org_id", OrganizationController.getOrgUsers);
  // Remove organization user route
  organizationRoutes.delete("/users/:user_id", OrganizationController.removeUser);
  // Add organization user route
  organizationRoutes.post("/users/:user_id", OrganizationController.addUser);
  // Update organization user role route
  organizationRoutes.post("/role/:user_id", OrganizationController.changeUserOrgRole);    
  // Send organization member invite route
  organizationRoutes.post("/invite/user", OrganizationController.sendInviteOrgMember);         
  // Accept organization member invite route
  organizationRoutes.post("/invite/accept", OrganizationController.acceptInviteOrgMember);         
  // List simple organization route
  organizationRoutes.get("/list-simple/:count", OrganizationController.listSimpleOrgs);
  // Delete organization route
  organizationRoutes.delete(
    "/:org_id",
    OrganizationController.deleteOrganization
  );
  // Get organization by name route
  organizationRoutes.get("/name/:org_name", OrganizationController.getOrgByName);
  // admin org report
  organizationRoutes.get("/admin/report", OrganizationController.adminOrgReports)
  // Contact organization route
  organizationRoutes.post("/contact/:id", OrganizationController.contactOrg);
  // Get invite member mail template route
  organizationRoutes.post("/mail/template", OrganizationController.getInviteMailTemplate);
  

  //= ========================
  // Project Routes
  //= ========================
  apiRoutes.use("/project", projectRoutes);

  // List project by user route
  projectRoutes.get("/", requireAuth, ProjectController.listProject);
  // Get project route
  projectRoutes.get("/:projectId", ProjectController.getProject);
  // Create project route
  projectRoutes.post("/", requireAuth, ProjectController.createProject);
  // Update project route
  projectRoutes.put("/", requireAuth, ProjectController.updateProject);
  // Delete project route
  projectRoutes.delete("/:projectId", ProjectController.deleteProject);
  // List creator project route
  projectRoutes.get("/participant/:participantId", ProjectController.listProjectByCreator)
  // Contact project creator route
  projectRoutes.post("/contact/:id", ProjectController.contactCreator);
  // Vote project route
  projectRoutes.post("/upvote/:id", requireAuth, ProjectController.voteProject);
  // Admin project list route
  projectRoutes.get("/admin/list", ProjectController.listAllProject);
  // send orginvitation route
  projectRoutes.post("/send-invite", requireAuth, ProjectController.sendInvite);
  // Get invite mail template route
  projectRoutes.post("/mail/template", ProjectController.getMailTemplate);


  //= ========================
  // Project comment Routes
  //= ========================
  apiRoutes.use("/comment", commentRoutes);
  // Create comment route
  commentRoutes.post("/", requireAuth, CommentController.createComment);
  // Update comment route
  commentRoutes.put("/", requireAuth, CommentController.updateComment);
  // List comment route
  commentRoutes.get("/:projectId", requireAuth, CommentController.listComment);
  // Delete comment route
  commentRoutes.delete("/:commentId", requireAuth, CommentController.deleteComment);
  // Like comment route
  commentRoutes.post("/like/:commentId", requireAuth, CommentController.likeComment);


  //= ========================
  // ProjectMember Routes
  //= ========================
  apiRoutes.use("/projectmember", projectMemberRoutes);
  // Get projects by user route
  projectMemberRoutes.get("/project/:userId", ProjectMemberController.listProject);
  // Get participants by project route
  projectMemberRoutes.get("/participant/:projectId", requireAuth, ProjectMemberController.listParticipant);
  // Join project route
  projectMemberRoutes.post("/:projectId", requireAuth, ProjectMemberController.joinProject);
  // Leave project route
  projectMemberRoutes.delete("/:projectId", requireAuth, ProjectMemberController.leaveProject);


  //= ========================
  // ProjectOrg Routes
  //= ========================
  apiRoutes.use("/projectorg", projectOrgRoutes);
  // Get projects by org route
  projectOrgRoutes.get("/project/:orgId", ProjectOrgController.listProject);
  // Get orgs by project route
  projectOrgRoutes.get("/org/:projectId", ProjectOrgController.listOrganization);
  // Join project route
  projectOrgRoutes.post("/:projectId", requireAuth, ProjectOrgController.joinProject);
  // Leave project route
  projectOrgRoutes.delete("/:projectId", requireAuth, ProjectOrgController.leaveProject);


  //= ========================
  // Field Data code Routes
  //= ========================
  apiRoutes.use("/fields", fieldDataRoutes);
  // Create field data route
  fieldDataRoutes.post("/", requireAuth, FieldDataController.createFieldData);
  // List field data route
  fieldDataRoutes.get("/", FieldDataController.listFieldData);
  // Delete field data route
  fieldDataRoutes.delete("/:id", requireAuth, FieldDataController.deleteFieldData)
  // Adjust List column route
  fieldDataRoutes.post("/update", requireAuth, FieldDataController.updateFieldData);


  //= ========================
  // Notification Routes
  //= ========================
  apiRoutes.use("/notification", notificationRoutes);
  // Send All participant notification route
  notificationRoutes.post("/all", requireAuth, NotificationController.notifyAllUsers);
  // Send project creators notification route
  notificationRoutes.post("/project-creator", requireAuth, NotificationController.notifyProjectCreators);
  // Send organizations notification route
  notificationRoutes.post("/organization", requireAuth, NotificationController.notifyOrganizations);
  // Get All notification route
  notificationRoutes.get("/", requireAuth, NotificationController.getNotification);
  // Read notification route
  notificationRoutes.post("/read", requireAuth, NotificationController.readNotification);


  //= ========================
  // Admin Routes
  //= ========================
  apiRoutes.use("/admin", adminRoutes);
  // Get All admin user profile route
  adminRoutes.get("/participant/all", requireAuth, AdminController.listAdminUsers);
  // List project creators route
  adminRoutes.get("/participant/project-creator", requireAuth, AdminController.listAdminProjectCreators);
  // Update user role
  adminRoutes.post("/role/:id", requireAuth, AdminController.updateRole);
  // admin user route
  adminRoutes.get("/user/:id", requireAuth, AdminController.getAdminUser);
  // update admin user route
  adminRoutes.post("/user/:id", requireAuth, AdminController.upateAdminUser);

  //= ========================
  // Article Routes
  //= ========================
  apiRoutes.use("/articles", articleRoutes);
  // create article document route
  articleRoutes.post("/", requireAuth, ArticleController.createArticle);
  // List article documents route
  articleRoutes.get("/", ArticleController.listArticle);
  // update article document route
  articleRoutes.put("/", requireAuth, ArticleController.updateArticle);
  // update bulk articles route
  articleRoutes.put("/bulk/list", requireAuth, ArticleController.bulkUpdateArticle);
  // delete article document route
  articleRoutes.delete("/:id", requireAuth, ArticleController.deleteArticle);

  
  //= ========================
  // InviteRequest Routes
  //= ========================
  apiRoutes.use("/invite", inviteRequestRoutes);
  // create invite request route
  inviteRequestRoutes.post("/", InviteRequestController.createInviteRequest);
  // List invite requests route
  inviteRequestRoutes.get("/", requireAuth, InviteRequestController.listInviteRequest);
  // resolve invite request route
  inviteRequestRoutes.put("/:id", requireAuth, InviteRequestController.resolveInviteRequest);


  //= ========================
  // Template Routes
  //= ========================
  apiRoutes.use("/templates", templateRoutes);
  // create template route
  templateRoutes.post("/", requireAuth, TemplateController.createTemplate);
  // List template by org route
  templateRoutes.get("/list/org/:orgId", TemplateController.listTemplateByOrg);
  // List global template route
  templateRoutes.get("/list/global", TemplateController.listTemplateGlobal);
  // update template route
  templateRoutes.put("/", requireAuth, TemplateController.updateTemplate);
  // Get template route
  templateRoutes.get("/:id", requireAuth, TemplateController.getTemplate);
  // Delete template route
  templateRoutes.delete("/:id", requireAuth, TemplateController.deleteTemplate);


  //= ========================
  // Mail Routes
  //= ========================
  apiRoutes.use("/mails", mailRoutes);
  // create mail route
  mailRoutes.post("/", requireAuth, MailController.createMail);
  // List mail by org route
  mailRoutes.get("/list/org/:org_id", MailController.listMailByOrg);
  // List global mail route
  mailRoutes.get("/list/global", MailController.listMailGlobal);
  // update mail route
  mailRoutes.put("/", requireAuth, MailController.updateMail);
  // Delete mail route
  mailRoutes.delete("/:id", requireAuth, MailController.deleteMail);
  // send test mail route
  mailRoutes.post("/test", MailController.sendTestMail);
  
  //= ========================
  // Faq Routes
  //= ========================
  apiRoutes.use("/faq", faqRoutes);
  // create faq route
  faqRoutes.post("/", requireAuth, FaqController.createFaq);
  // List faq route
  faqRoutes.get("/", requireAuth, FaqController.listFaq);
  // update faq route
  faqRoutes.put("/", requireAuth, FaqController.updateFaq);
  // update faq route
  faqRoutes.put("/bulk/list", requireAuth, FaqController.bulkUpdateFaq);
  // delete faq route
  faqRoutes.delete("/:id", requireAuth, FaqController.deleteFaq);


  //= ========================
  // Chat Routes
  //= ========================
  apiRoutes.use("/chat", chatRoutes);
  // View messages to and from authenticated user
  chatRoutes.get("/", requireAuth, ChatController.getConversations);
  // Retrieve single conversation
  chatRoutes.get(
    "/:conversationId",
    requireAuth,
    ChatController.getConversation
  );
  // Create team chat route
  chatRoutes.post("/team/new", requireAuth, ChatController.createTeamChat)
  // Send reply in conversation
  chatRoutes.post("/:conversationId", requireAuth, ChatController.sendReply);
  // Start new conversation
  chatRoutes.post(
    "/new/:recipient",
    requireAuth,
    ChatController.newConversation
  );
  // Update message route
  chatRoutes.put("/message", requireAuth, ChatController.updateMessage);
  // Delete message route
  chatRoutes.delete("/message/:messageId", requireAuth, ChatController.deleteMessage);
  // Block chat route
  chatRoutes.post("/block/:userid", requireAuth, ChatController.blockChat)
  // Block chat route
  chatRoutes.get("/participant/:userid", requireAuth, ChatController.getOneConversation)


  //= ========================
  // Timeline Routes
  //= ========================
  apiRoutes.use("/timeline", timelineRoutes);
  // list timeline by project id route
  timelineRoutes.get("/:projectId", requireAuth, TimelineController.listTimeline);
  // create timeline route
  timelineRoutes.post("/", requireAuth, TimelineController.createTimeline);
  // update timeline route
  timelineRoutes.put("/", requireAuth, TimelineController.updateTimeline);
  // delete timeline route
  timelineRoutes.delete("/:id", requireAuth, TimelineController.deleteTimeline);

  // Set url for API group routes
  app.use("/api", apiRoutes);
};
