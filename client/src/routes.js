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
import OrgInviteMember from "./containers/home/invite/org-invite";
import OrgDashboard from "./containers/organization/dashboard";

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
import Dashboard from "./containers/dashboard";
import Account from "./containers/user";

// Import chat related pages
import MessageBox from "./containers/message";

import UserDashboard from "./containers/user/dashboard";

// Import admin related Pages
import AdminDashboard from "./containers/admin";
import SuperAdminDashboard from "./containers/admin/super";

// Import notification pages
import Notification from "./containers/notification";
import Faq from "./containers/faq";

// Import higher order components
import RequireAuth from "./containers/auth/require_auth";
import { protectedTest } from "./actions/auth";
import { listFieldData } from "./actions/profile";
import { listArticle } from "./actions/article";
import { listGlobalTemplate } from "./actions/template";
import { fetchConversations } from "./actions/message";
import { fetchNotifications } from "./actions/notification";

class Routes extends React.Component {
  componentDidMount = async () => {
    await this.props.protectedTest();
    this.props.fetchConversations();
    this.props.fetchNotifications();
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
          <Route path="/:org_name/email-invite" component={InviteHomePage} />
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
          <Route path="/account" component={RequireAuth(Account)} />

          <Route path="/user/:user_id" component={RequireAuth(UserDashboard)} />

          <Route path="/:org/projects" component={RequireAuth(Projectslist)} />
          <Route path="/:org/project/:id" component={RequireAuth(Project)} />
          <Route
            path="/:org/select-template"
            component={RequireAuth(SelectTemplate)}
          />

          <Route
            path="/:org/template/:id"
            component={RequireAuth(TemplatePage)}
          />

          <Route path="/techhub" component={RequireAuth(Techhub)} />
          <Route path="/learnhub" component={RequireAuth(LearnHub)} />

          <Route path="/admin" component={RequireAuth(AdminDashboard)} />
          <Route path="/super" component={RequireAuth(SuperAdminDashboard)} />
          <Route path="/messages" component={RequireAuth(MessageBox)} />
          <Route path="/notification" component={RequireAuth(Notification)} />
          <Route path="/faq" component={Faq} />
          <Route path="/dashboard" component={RequireAuth(Dashboard)} />
          <Route path="/:org_name" component={RequireAuth(OrgDashboard)} />

          <Route path="*" component={NotFoundPage} />
        </Switch>
        <BackTop />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, {
  protectedTest,
  listFieldData,
  listArticle,
  listGlobalTemplate,
  fetchConversations,
  fetchNotifications,
})(Routes);
