const AuthenticationController = require("./controllers/authentication");
const UserController = require("./controllers/user");
const ChatController = require("./controllers/chat");
const ChallengeController = require("./controllers/challenge");
const OrganizationController = require("./controllers/organization");
const FieldDataController = require("./controllers/fielddata");
const ProjectController = require("./controllers/project");
const ProjectMemberController = require("./controllers/projectmember");
const SearchController = require("./controllers/search");
const SSRController = require("./controllers/ssr");
const CommentController = require("./controllers/comment");
const AdminController = require("./controllers/admin");
const NotificationController = require("./controllers/notification");
const GalleryController = require("./controllers/gallery");
const ReportController = require("./controllers/report");
const SecurityQuestionController = require("./controllers/securityquestion");
const AnnounceController = require("./controllers/announce");
const HelpDocController = require("./controllers/helpdoc");
const LabelController = require("./controllers/label");
const ResourceController = require("./controllers/resource");
const FaqController = require("./controllers/faq");
var multer  = require('multer')
const express = require("express");
const passport = require("passport");
const ROLE_ADMIN = require("./constants").ROLE_ADMIN;

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
    chatRoutes = express.Router(),
    challengeRoutes = express.Router(),
    organizationRoutes = express.Router(),
    projectRoutes = express.Router(),
    projectMemberRoutes = express.Router(),
    searchRoutes = express.Router(),
    ssrRoutes = express.Router(),
    commentRoutes = express.Router(),
    adminRoutes = express.Router(),
    notificationRoutes = express.Router(),
    galleryRoutes = express.Router(),
    reportRoutes = express.Router(),
    securityquestionRoutes = express.Router(),
    announceRoutes = express.Router(),
    helpdocRoutes = express.Router(),
    labelRoutes = express.Router(),
    resourceRoutes = express.Router(),
    faqRoutes = express.Router(),
    fieldDataRoutes = express.Router();


  //= ========================
  // Auth Routes
  //= ========================
  apiRoutes.use("/auth", authRoutes);
  // Participant Registration route
  authRoutes.post("/user-register", AuthenticationController.participantRegister);
  // Organization Registration route
  authRoutes.post("/org-register", AuthenticationController.orgRegister);
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
  // send invitation route
  authRoutes.post("/send-invite", upload.single('file'), AuthenticationController.sendInvite);

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
  // Admin route
  apiRoutes.get(
    "/admins-only",
    requireAuth,
    AuthenticationController.roleAuthorization(ROLE_ADMIN),
    (req, res) => {
      res.send({ content: "Admin dashboard is working." });
    }
  );
  // Get Users associated with organizations route
  userRoutes.get("/users/:org_id", requireAuth, UserController.orgUsers)
  // Restrict user profile route
  userRoutes.post("/restrict/:id", requireAuth, UserController.restrictUser);
  // Block user profile route
  userRoutes.post("/block/:id", requireAuth, UserController.blockUser);
  // Mentors route
  userRoutes.get("/mentor/list", requireAuth, UserController.listMentors);
  // All user route
  userRoutes.get("/simple-user/list", requireAuth, UserController.listSimpleParticipants);
  // All Unverified participant route
  userRoutes.get("/unverified/list", requireAuth, UserController.adminListUnverifiedParticipants);
  // Verify user profile route
  userRoutes.post("/unverified/:id", requireAuth, UserController.adminVerifyParticipant);


  //= ========================
  // Organization Routes
  //= ========================
  apiRoutes.use("/organization", organizationRoutes);
  // Get organization route
  organizationRoutes.get("/:org_id", OrganizationController.getOrganization);
  // Update organization route
  organizationRoutes.put("/", OrganizationController.updateOrganization);
  // List organization route
  organizationRoutes.post("/list/:count", OrganizationController.listOrganization);
  // List simple organization route
  organizationRoutes.get("/list-simple/:count", OrganizationController.listSimpleOrgs);
  // Delete organization route
  organizationRoutes.delete(
    "/:org_id",
    OrganizationController.deleteOrganization
  );
  // Password reset request route (generate/send token)
  organizationRoutes.post("/forgot-password", OrganizationController.forgotPassword);
  // admin org report
  organizationRoutes.get("/admin/report", OrganizationController.adminOrgReports)
  // admin org user report
  organizationRoutes.get("/admin/user-report", OrganizationController.adminOrgWithUsers)
  // Contact organization route
  organizationRoutes.post("/contact/:id", OrganizationController.contactOrg);
  // All Unverified organization route
  organizationRoutes.get("/unverified/list", requireAuth, OrganizationController.adminListUnverifiedOrganizations);
  // Verify organization profile route
  organizationRoutes.post("/unverified/:id", requireAuth, OrganizationController.adminVerifyOrganization);

  
  //= ========================
  // Challenge Routes
  //= ========================
  apiRoutes.use("/challenge", challengeRoutes);
  // Get challenge route
  challengeRoutes.get("/:challenge_id", ChallengeController.getChallenge);
  // Create Challenge route
  challengeRoutes.post("/", requireAuth, ChallengeController.createChallenge);
  // Update Challenge route
  challengeRoutes.put("/", requireAuth, ChallengeController.updateChallenge);
  // List all challenge route
  challengeRoutes.post("/list/:count", requireAuth, ChallengeController.listChallenge);
  // List Challenges by organization route
  challengeRoutes.get("/org/:org_id", requireAuth, ChallengeController.listChallengesByOrg);
  // List Challenges by participant route
  challengeRoutes.get("/user/:user_id", requireAuth, ChallengeController.listChallengesByUser);
  // Delete challenge route
  challengeRoutes.delete("/:challenge_id", requireAuth, ChallengeController.deleteChallenge);
  // Vote Challenge route
  challengeRoutes.post("/upvote/:id", requireAuth, ChallengeController.voteChallenge);
  // Admin Feature Challenge route
  challengeRoutes.post("/feature/:id", requireAuth, ChallengeController.featureChallenge);
  // Admin challenge list route
  challengeRoutes.get("/admin/list", requireAuth, ChallengeController.adminListChallenge);


  //= ========================
  // Project Routes
  //= ========================
  apiRoutes.use("/project", projectRoutes);
  // Get project route
  projectRoutes.get("/:projectId", ProjectController.getProject);
  // Create project route
  projectRoutes.post("/", ProjectController.createProject);
  // Update project route
  projectRoutes.put("/", ProjectController.updateProject);
  // List project route
  projectRoutes.post("/list/:count", ProjectController.listProject);
  // Delete project route
  projectRoutes.delete("/:projectId", ProjectController.deleteProject);
  // List challenge project route
  projectRoutes.get("/challenge/:challengeId", ProjectController.challengeProjects)
  // List challenge project route
  projectRoutes.get("/participant/:participantId", ProjectController.listProjectByCreator)
  // Contact project creator route
  projectRoutes.post("/contact/:id", ProjectController.contactCreator);
  // Update project sharer route
  projectRoutes.post("/share/:id", ProjectController.updateProjectSharers);
  // Vote project route
  projectRoutes.post("/upvote/:id", requireAuth, ProjectController.voteProject);
  // Admin project list route
  projectRoutes.get("/admin/list", ProjectController.listAllProject);

  //= ========================
  // Project comment Routes
  //= ========================
  apiRoutes.use("/comment", commentRoutes);
  // Create comment route
  commentRoutes.post("/", requireAuth, CommentController.createComment);
  // Create challenge comment route
  commentRoutes.post("/challenge", requireAuth, CommentController.createChallengeComment);
  // Update comment route
  commentRoutes.put("/", requireAuth, CommentController.updateComment);
  // List comment route
  commentRoutes.get("/:projectId", requireAuth, CommentController.listComment);
  // List challenge comment route
  commentRoutes.get("/challenge/:challengeId", requireAuth, CommentController.listChallengeComment);
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
  // Get public participants by project route
  projectMemberRoutes.get("/pub-participant/:projectId", ProjectMemberController.listPublicParticipant);
  // Join project route
  projectMemberRoutes.post("/:projectId", requireAuth, ProjectMemberController.joinProject);
  // Leave project route
  projectMemberRoutes.delete("/:projectId", requireAuth, ProjectMemberController.leaveProject);
  // Invite participant to project route
  projectMemberRoutes.post("/invite/:projectId", requireAuth, ProjectMemberController.inviteParticipant);
  // Accept Invitation project team route
  projectMemberRoutes.post("/invite-accept/:pmId", requireAuth, ProjectMemberController.acceptInviteTeam);
  // Cancel invite participant to project route
  projectMemberRoutes.post("/invite-cancel/:projectId", requireAuth, ProjectMemberController.cancelInviteParticipant);


  //= ========================
  // Search Routes
  //= ========================
  apiRoutes.use("/search", searchRoutes);
  // Get total search route
  searchRoutes.get("/total/:searchTxt", SearchController.totalSearch);


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
  // Adjust Mentor route
  fieldDataRoutes.post("/set-mentor", requireAuth, FieldDataController.setMentorData);
  // Adjust Summary route
  fieldDataRoutes.post("/summary", requireAuth, FieldDataController.setSummaryData);
  // Adjust List column route
  fieldDataRoutes.post("/update", requireAuth, FieldDataController.updateFieldData);

  //= ========================
  // SSR render Routes
  //= ========================
  apiRoutes.use("/public", ssrRoutes);
  // Render challenge route
  ssrRoutes.get("/challenge/:challenge_id", SSRController.RenderChallenge);


  //= ========================
  // Gallery Routes
  //= ========================
  apiRoutes.use("/gallery", galleryRoutes);
  // Get gallery route
  galleryRoutes.get("/:gallery_id", GalleryController.getGallery);
  // Get project gallery route
  galleryRoutes.get("/project/:project_id", GalleryController.getProjectGallery);
  // Create Gallery route
  galleryRoutes.post("/", requireAuth,  GalleryController.createGallery);
  // Update Gallery route
  galleryRoutes.put("/", requireAuth,  GalleryController.updateGallery);
  // List all gallery route
  galleryRoutes.post("/list/:count", GalleryController.listGallery);
  // Delete gallery route
  galleryRoutes.delete("/:gallery_id", requireAuth,  GalleryController.deleteGallery);
  // Make Private Gallery route
  galleryRoutes.post("/private/:id", requireAuth,  GalleryController.privateGallery);

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
  // Invite members to team chat route
  chatRoutes.post("/invite/:channelId", requireAuth, ChatController.inviteMember)
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
  // Report Routes
  //= ========================
  apiRoutes.use("/report", reportRoutes);
  // Create Report route
  reportRoutes.post("/participant/:userid", requireAuth,  ReportController.createReport);
  // Resove Report route
  reportRoutes.put("/:id", requireAuth,  ReportController.resolveReport);
  // List all report route
  reportRoutes.get("/list", ReportController.getReports);

  
  //= ========================
  // Security Question Routes
  //= ========================
  apiRoutes.use("/securityquestion", securityquestionRoutes);
  // Create Question route
  securityquestionRoutes.post("/", requireAuth,  SecurityQuestionController.createQuestion);
  // Update Question route
  securityquestionRoutes.put("/", requireAuth,  SecurityQuestionController.updateQuestion);
  // Resove Report route
  securityquestionRoutes.get("/user", requireAuth,  SecurityQuestionController.getQuestion);
  // List all questions route
  securityquestionRoutes.get("/list", SecurityQuestionController.listQuestions);
  // Check Question route
  securityquestionRoutes.post("/check",  SecurityQuestionController.checkQuestion);

  //= ========================
  // Announce Routes
  //= ========================
  apiRoutes.use("/announce", announceRoutes);
  // Get All admin announce route
  announceRoutes.get("/list/all", requireAuth, AnnounceController.listAnnounce);
  // Get one announce route
  announceRoutes.get("/:id", requireAuth, AnnounceController.getAnnounce);
  // Create an announce route
  announceRoutes.post("/", requireAuth, AnnounceController.createAnnounce);
  // Update one announce route
  announceRoutes.put("/", requireAuth, AnnounceController.updateAnnounce);
  // Get recent active announce route
  announceRoutes.get("/recent/one", AnnounceController.getRecentAnnounce);

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
  // get admin email templates route
  adminRoutes.get("/email/template", requireAuth, AdminController.getAdminEmailTemplates);


  //= ========================
  // HelpDoc Routes
  //= ========================
  apiRoutes.use("/help", helpdocRoutes);
  // create help document route
  helpdocRoutes.post("/create", requireAuth, HelpDocController.createHelpDoc);
  // List help documents route
  helpdocRoutes.get("/list", HelpDocController.listHelpDoc);
  // update help document route
  helpdocRoutes.post("/update", requireAuth, HelpDocController.updateHelpDoc);
  // delete help document route
  helpdocRoutes.delete("/delete/:id", requireAuth, HelpDocController.deleteHelpDoc);

  //= ========================
  // Label Routes
  //= ========================
  apiRoutes.use("/label", labelRoutes);
  // List label route
  labelRoutes.get("/list", LabelController.fetchLabelData);
  // update help document route
  labelRoutes.post("/update", requireAuth, LabelController.updateLabelData);

  //= ========================
  // Resource Routes
  //= ========================
  apiRoutes.use("/resource", resourceRoutes);
  // create resource route
  resourceRoutes.post("/", requireAuth, ResourceController.createResource);
  // List resources route
  resourceRoutes.get("/", requireAuth, ResourceController.listResource);
  // update resource route
  resourceRoutes.put("/", requireAuth, ResourceController.updateResource);
  // delete resource route
  resourceRoutes.delete("/:id", requireAuth, ResourceController.deleteResource);

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


  // Set url for API group routes
  app.use("/api", apiRoutes);
};
