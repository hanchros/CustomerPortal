const AuthenticationController = require("./controllers/authentication");
const UserController = require("./controllers/user");
const OrganizationController = require("./controllers/organization");
const FieldDataController = require("./controllers/fielddata");
const ProjectController = require("./controllers/project");
const ProjectMemberController = require("./controllers/projectmember");
const CommentController = require("./controllers/comment");
const AdminController = require("./controllers/admin");
const NotificationController = require("./controllers/notification");
const HelpDocController = require("./controllers/helpdoc");
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
    commentRoutes = express.Router(),
    adminRoutes = express.Router(),
    notificationRoutes = express.Router(),
    helpdocRoutes = express.Router(),
    fieldDataRoutes = express.Router();


  //= ========================
  // Auth Routes
  //= ========================
  apiRoutes.use("/auth", authRoutes);
  // Participant Registration route
  authRoutes.post("/user-register", AuthenticationController.participantRegister);
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
  authRoutes.post("/send-invite", requireAuth, AuthenticationController.sendInvite);


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


  //= ========================
  // Organization Routes
  //= ========================
  apiRoutes.use("/organization", organizationRoutes);
  // Create organization route
  organizationRoutes.post("/", requireAuth, OrganizationController.createOrganization);
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
  // admin org report
  organizationRoutes.get("/admin/report", OrganizationController.adminOrgReports)
  // admin org user report
  organizationRoutes.get("/admin/user-report", OrganizationController.adminOrgWithUsers)
  // Contact organization route
  organizationRoutes.post("/contact/:id", OrganizationController.contactOrg);
  

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
  // List creator project route
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


  // Set url for API group routes
  app.use("/api", apiRoutes);
};
