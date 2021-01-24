import React from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { BackTop } from "antd";

// Import miscellaneous routes and other requirements
import NotFoundPage from "./components/pages/not-found-page";

// Import static pages
import HomePage from "./containers/home";

// Import intro pages
import IntegraSpace from "./containers/intro/integra-space";
import InvitePage from "./containers/intro/invite";
import InviteHomePage from "./containers/home/invite";

// Import organization pages
import Organization from "./containers/organization/dashboard";
import OrgProfile from "./containers/organization/profile";
import OrgInviteMember from "./containers/home/invite/org-invite";

// Import project pages
import Projectslist from "./containers/project/list";
import Project from "./containers/project/project";
import SelectTemplate from "./containers/project/select-template";
import TemplatePage from "./containers/template";

// Import techhub pages
import Techhub from "./containers/techhub/techhub";
import LearnHub from "./containers/techhub/learn";

// Import authentication related pages
// import Register from "./containers/auth/register";
import RegisterConfirm from "./containers/auth/register-confirm";
import Login from "./containers/auth/login";
import Logout from "./containers/auth/logout";
import ForgotPassword from "./containers/auth/forgot_password";
import ResetPassword from "./containers/auth/reset_password";
import Resend from "./containers/auth/resend";
import ConfirmEmail from "./containers/auth/confirm-email";

// Import user related Pages
// import Dashboard from "./containers/dashboard";
import Participant from "./containers/user/user";
import Profile from "./containers/user/profilepage";
import ParticipantsList from "./containers/user/list";
import OrganizationList from "./containers/organization/list";

// Import admin related Pages
import AdminDashboard from "./containers/admin";
import SuperAdminDashboard from "./containers/admin/super";

// Import notification pages
import Notification from "./containers/notification";

// Import Help related pages
import Help from "./containers/help";
import HelpArticle from "./containers/help/article";
import HelpCategory from "./containers/help/category";
import HelpSearch from "./containers/help/search";
import Faq from "./containers/faq";

// Import higher order components
import RequireAuth from "./containers/auth/require_auth";
import { protectedTest } from "./actions/auth";
import { listFieldData } from "./actions/profile";
import { listArticle } from "./actions/article";
import { listGlobalTemplate } from "./actions/template";

class Routes extends React.Component {
  componentDidMount = async () => {
    await this.props.protectedTest();
    this.props.listFieldData();
    this.props.listArticle();
    this.props.listGlobalTemplate();
  };

  render() {
    return (
      <div className="layout">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/integraspace" component={IntegraSpace} />
          <Route path="/invitation" component={InvitePage} />
          <Route path="/email-invite" component={InviteHomePage} />
          <Route
            path="/org-invite/:org_id/:email"
            component={OrgInviteMember}
          />

          <Route path="/register" component={RegisterConfirm} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/forgot-password/:mode" component={ForgotPassword} />
          <Route
            path="/reset-password/:mode/:resetToken"
            component={ResetPassword}
          />
          <Route path="/resend" component={Resend} />
          <Route path="/email-verify/:mode/:token" component={ConfirmEmail} />
          <Route path="/profile" component={RequireAuth(Profile)} />

          {/* <Route path="/dashboard" component={RequireAuth(Dashboard)} /> */}

          <Route path="/organizations" component={OrganizationList} />
          <Route
            path="/organization/:id"
            component={RequireAuth(Organization)}
          />
          <Route path="/org-profile" component={OrgProfile} />

          <Route path="/participants" component={ParticipantsList} />
          <Route path="/participant/:id" component={Participant} />

          <Route path="/dashboard" component={RequireAuth(Projectslist)} />
          <Route path="/project/:id" component={RequireAuth(Project)} />
          <Route
            path="/select-template"
            component={RequireAuth(SelectTemplate)}
          />

          <Route path="/template/:id" component={RequireAuth(TemplatePage)} />

          <Route path="/techhub" component={RequireAuth(Techhub)} />
          <Route path="/learnhub" component={RequireAuth(LearnHub)} />

          <Route path="/admin" component={RequireAuth(AdminDashboard)} />
          <Route path="/super" component={RequireAuth(SuperAdminDashboard)} />
          <Route path="/notification" component={RequireAuth(Notification)} />

          <Route path="/help" component={Help} />
          <Route
            path="/help-article/:category/:articleId"
            component={HelpArticle}
          />
          <Route path="/help-category/:category" component={HelpCategory} />
          <Route path="/help-search/:search" component={HelpSearch} />
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
  listFieldData,
  listArticle,
  listGlobalTemplate,
})(Routes);
