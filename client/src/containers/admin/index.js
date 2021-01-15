import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  GlobalOutlined,
  TeamOutlined,
  UserOutlined,
  ProfileOutlined,
  SketchOutlined,
  PicLeftOutlined,
  UsergroupAddOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Header } from "../../components/template";
import { getOrganization } from "../../actions/organization";
import history from "../../history";
import UserAll from "./user/all";
import Creators from "./user/creators";
import Message from "./user/message";
import Verify from "./user/unverified";
import Constants from "./constants";
import OrgAll from "./organization/org_report";
import ProjectAll from "./project/project_report";
import Article from "./article";
import EmailTemplate from "./setting/email-template";
import OrgBasics from "./org_admin/basic";
import OrgBranding from "./org_admin/branding";
import OrgTemplate from "./org_admin/template";
import OrgUsers from "./org_admin/users";
import SupTemplate from "./template";

const { Content, Sider } = Layout;

class AdminDashboard extends Component {
  state = {
    collapsed: false,
    pageTitle: "",
    submenu: "",
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  componentDidMount() {
    const { isAdmin, orgAdmin, user, getOrganization } = this.props;
    if (!isAdmin && !orgAdmin) {
      history.push("/dashboard");
      return;
    }
    if (orgAdmin) {
      getOrganization(user.profile.org._id);
    }
  }

  switchPage = (submenu, pageTitle) => {
    this.setState({ submenu, pageTitle });
  };

  render() {
    const { pageTitle, submenu } = this.state;
    const { isAdmin, orgAdmin } = this.props;
    return (
      <React.Fragment>
        <Header />
        <Layout className="message-box">
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
              {orgAdmin && (
                <React.Fragment>
                  <Menu.Item
                    key="org-basic"
                    onClick={() => this.switchPage("Organization", "Basics")}
                  >
                    <span>
                      <ProfileOutlined />
                      <span>Basics</span>
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    key="org-branding"
                    onClick={() => this.switchPage("Organization", "Branding")}
                  >
                    <span>
                      <SketchOutlined />
                      <span>Branding</span>
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    key="org-templates"
                    onClick={() => this.switchPage("Organization", "Templates")}
                  >
                    <span>
                      <PicLeftOutlined />
                      <span>Templates</span>
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    key="org-users"
                    onClick={() => this.switchPage("Organization", "Users")}
                  >
                    <span>
                      <UsergroupAddOutlined />
                      <span>Users</span>
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    key="org-emails"
                    onClick={() => this.switchPage("Organization", "Emails")}
                  >
                    <span>
                      <MailOutlined />
                      <span>Emails</span>
                    </span>
                  </Menu.Item>
                </React.Fragment>
              )}
              {isAdmin && (
                <React.Fragment>
                  <Menu.Item
                    key="articles"
                    onClick={() => this.switchPage("Super", "Articles")}
                  >
                    <span>
                      <ProfileOutlined />
                      <span>Articles</span>
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    key="sup-template"
                    onClick={() => this.switchPage("Super", "Template")}
                  >
                    <span>
                      <PicLeftOutlined />
                      <span>Super Templates</span>
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    key="org-all"
                    onClick={() => this.switchPage("Super", "Organization")}
                  >
                    <span>
                      <TeamOutlined />
                      <span>Organizations</span>
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    key="pt-all"
                    onClick={() => this.switchPage("Super", "Users")}
                  >
                    <span>
                      <UserOutlined />
                      <span>Users</span>
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    key="sup-emails"
                    onClick={() => this.switchPage("Super", "Emails")}
                  >
                    <span>
                      <MailOutlined />
                      <span>Global Emails</span>
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    key="sup-app"
                    onClick={() => this.switchPage("Super", "Applications")}
                  >
                    <span>
                      <GlobalOutlined />
                      <span>Applications</span>
                    </span>
                  </Menu.Item>
                </React.Fragment>
              )}

              {/* {isAdmin && (
              )}
              {isAdmin && (
                <SubMenu
                  key="sub4"
                  title={
                    <span>
                      <ProjectOutlined />
                      <span>Project</span>
                    </span>
                  }
                >
                  <Menu.Item
                    key="prj-all"
                    onClick={() => this.switchPage("Project", "All")}
                  >
                    All
                  </Menu.Item>
                </SubMenu>
              )}
              {isSuper && (
                <SubMenu
                  key="sub6"
                  title={
                    <span>
                      <SettingOutlined />
                      <span>Setting</span>
                    </span>
                  }
                >
                  <Menu.Item
                    key="set-cst"
                    onClick={() => this.switchPage("Setting", "Constants")}
                  >
                    Constants
                  </Menu.Item>
                </SubMenu>
              )} */}
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Content style={{ margin: "0 16px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>{submenu}</Breadcrumb.Item>
                <Breadcrumb.Item>{pageTitle}</Breadcrumb.Item>
              </Breadcrumb>
              <div className="admin-main">{this.renderPage()}</div>
            </Content>
          </Layout>
        </Layout>
      </React.Fragment>
    );
  }

  renderPage = () => {
    const { pageTitle, submenu } = this.state;
    let pageName = `${submenu} ${pageTitle}`;
    switch (pageName) {
      case "Super Users":
        return <UserAll />;
      case "Participant Project Owners":
        return <Creators />;
      case "Participant Message":
        return <Message />;
      case "Participant Verify":
        return <Verify />;
      case "Super Organization":
        return <OrgAll />;
      case "Project All":
        return <ProjectAll />;
      case "Setting Constants":
        return <Constants />;
      case "Super Articles":
        return <Article />;
      case "Super Template":
        return <SupTemplate />;
      case "Setting Email":
        return <EmailTemplate />;
      case "Organization Basics":
        return <OrgBasics />;
      case "Organization Branding":
        return <OrgBranding />;
      case "Organization Templates":
        return <OrgTemplate />;
      case "Organization Users":
        return <OrgUsers />;
      case "Super Emails":
      case "Organization Emails":
        return <EmailTemplate />;
      default:
        return null;
    }
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    isAdmin: state.user.isAdmin,
    isSuper: state.user.isSuper,
    orgAdmin: state.user.orgAdmin,
  };
};

export default connect(mapStateToProps, { getOrganization })(AdminDashboard);
