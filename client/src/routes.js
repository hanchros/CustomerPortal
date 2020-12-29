import React from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { BackTop } from "antd";

// Import miscellaneous routes and other requirements
import NotFoundPage from "./components/pages/not-found-page";

// Import static pages
import HomePage from "./containers/home";

// Import intro pages
import IntegraSpace from "./containers/intro/integra-space"
import InvitePage from "./containers/intro/invite"

// Import organization pages
import Organization from "./containers/organization/dashboard";
import OrgDashboard from "./containers/organization/org-dashboard";
import OrgProfile from "./containers/organization/profile";
import OrgSummary from "./containers/organization/summary";

// Import challenge pages
import ChallengesList from "./containers/challenge/list";
import Challenge from "./containers/challenge/challenge";

// Import project pages
import Projectslist from "./containers/project/list";
import Project from "./containers/project/project";

// Import authentication related pages
import Register from "./containers/auth/register";
import RegisterConfirm from "./containers/auth/register-confirm";
import Login from "./containers/auth/login";
import Logout from "./containers/auth/logout";
import ForgotPassword from "./containers/auth/forgot_password";
import ResetPassword from "./containers/auth/reset_password";
import Resend from "./containers/auth/resend";
import ConfirmEmail from "./containers/auth/confirm-email";
import SendInvite from "./containers/auth/invite";

// Import user related Pages
import UserDashboard from "./containers/user/dashboard";
import Participant from "./containers/user/user";
import Profile from "./containers/user/profilepage";
import Summary from "./containers/user/summary";
import ParticipantsList from "./containers/user/list";
import OrganizationList from "./containers/organization/list";
import MentorList from "./containers/user/mentor-list";

// Import gallery related pages
import Gallery from "./containers/gallery/gallery";
import ListGallery from "./containers/gallery/list";

// Import admin related Pages
import AdminDashboard from "./containers/admin";
import CheckKey from "./containers/admin/check_key";

// Import chat related pages
import MessageBox from "./containers/message";

// Import notification pages
import Notification from "./containers/notification";

// Import Help related pages
import Help from "./containers/help";
import HelpArticle from "./containers/help/article";
import HelpCategory from "./containers/help/category";
import HelpSearch from "./containers/help/search";
// import Resource from "./containers/resource";
import Faq from "./containers/faq";

// Import higher order components
import RequireAuth from "./containers/auth/require_auth";
import { protectedTest } from "./actions/auth";
import { fetchConversations } from "./actions/message";
import { fetchNotifications } from "./actions/notification";
import { listQuestions, getQuestion } from "./actions/question";
import { listFieldData } from "./actions/profile";
import { getRecentAnnounce } from "./actions/announce";
import { listHelpDoc } from "./actions/help";
import { listLabel } from "./actions/label";

class Routes extends React.Component {
  componentDidMount = async () => {
    await this.props.protectedTest();
    this.props.fetchConversations();
    this.props.fetchNotifications();
    this.props.listQuestions();
    this.props.listFieldData();
    this.props.getQuestion();
    this.props.getRecentAnnounce();
    this.props.listHelpDoc();
    this.props.listLabel();
  };

  render() {
    return (
      <div className="layout">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/integraspace" component={IntegraSpace} />
          <Route path="/invitation" component={InvitePage} />

          <Route path="/register" component={RegisterConfirm} />
          <Route path="/register-form" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/forgot-password/:mode" component={ForgotPassword} />
          <Route
            path="/reset-password/:mode/:resetToken"
            component={ResetPassword}
          />
          <Route path="/resend" component={Resend} />
          <Route path="/email-verify/:mode/:token" component={ConfirmEmail} />
          <Route path="/summary" component={Summary} />
          <Route path="/profile" component={RequireAuth(Profile)} />
          <Route path="/invite" component={RequireAuth(SendInvite)} />

          <Route path="/user-dashboard" component={UserDashboard} />
          <Route path="/org-dashboard" component={RequireAuth(OrgDashboard)} />

          <Route path="/organizations" component={OrganizationList} />
          <Route
            path="/organization/:id"
            component={RequireAuth(Organization)}
          />
          <Route path="/org-profile" component={OrgProfile} />
          <Route path="/org-summary" component={OrgSummary} />

          <Route path="/challenges" component={ChallengesList} />
          <Route path="/challenge/:id" component={Challenge} />

          <Route path="/participants" component={ParticipantsList} />
          <Route path="/participant/:id" component={Participant} />

          <Route path="/mentors" component={MentorList} />

          <Route path="/projects" component={Projectslist} />
          <Route path="/project/:id" component={RequireAuth(Project)} />

          <Route path="/gallery/:id" component={Gallery} />
          <Route path="/gallery" component={ListGallery} />

          <Route path="/admin" component={RequireAuth(AdminDashboard)} />
          <Route path="/check/key" component={CheckKey} />

          <Route path="/message" component={RequireAuth(MessageBox)} />

          <Route path="/notification" component={RequireAuth(Notification)} />

          <Route path="/help" component={Help} />
          <Route
            path="/help-article/:category/:articleId"
            component={HelpArticle}
          />
          <Route path="/help-category/:category" component={HelpCategory} />
          <Route path="/help-search/:search" component={HelpSearch} />
          {/* <Route path="/resource" component={Resource} /> */}
          <Route path="/faq" component={Faq} />

          <Route path="*" component={NotFoundPage} />
        </Switch>
        <BackTop />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps, {
  protectedTest,
  fetchConversations,
  fetchNotifications,
  listQuestions,
  listFieldData,
  getQuestion,
  getRecentAnnounce,
  listHelpDoc,
  listLabel,
})(Routes);
