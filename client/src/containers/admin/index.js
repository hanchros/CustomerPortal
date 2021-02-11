import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Menu, Breadcrumb, Skeleton } from "antd";
import {
  ProfileOutlined,
  SketchOutlined,
  PicLeftOutlined,
  UsergroupAddOutlined,
  MailOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { Header } from "../../components/template";
import { getOrganization } from "../../actions/organization";
import OrgEmailTemplate from "./org_admin/email-template";
import OrgBasics from "./org_admin/basic";
import OrgBranding from "./org_admin/branding";
import OrgTemplate from "./org_admin/template";
import OrgUsers from "./org_admin/users";
import Projects from "./org_admin/project";

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

  componentDidMount = async () => {
    const { getOrganization, user } = this.props;
    if (!user.profile) return;
    await getOrganization(user.profile.org._id);
    this.setState({
      pageTitle: "Profile",
      submenu: "Organization",
    });
  };

  switchPage = (submenu, pageTitle) => {
    this.setState({ submenu, pageTitle });
  };

  render() {
    const { pageTitle, submenu } = this.state;
    const { orgAdmin } = this.props;
    return (
      <React.Fragment>
        <Header />
        <Skeleton active loading={!orgAdmin} />
        <Skeleton active loading={!orgAdmin} />
        <Skeleton active loading={!orgAdmin} />
        {orgAdmin && (
          <Layout className="message-box">
            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
            >
              <Menu
                theme="dark"
                defaultSelectedKeys={["org-basic"]}
                mode="inline"
              >
                <Menu.Item
                  key="org-basic"
                  onClick={() => this.switchPage("Organization", "Profile")}
                >
                  <span>
                    <ProfileOutlined />
                    <span>Organization profile</span>
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
                  key="org-projects"
                  onClick={() => this.switchPage("Organization", "Projects")}
                >
                  <span>
                    <ProjectOutlined />
                    <span>Projects</span>
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
        )}
      </React.Fragment>
    );
  }

  renderPage = () => {
    const { pageTitle, submenu } = this.state;
    let pageName = `${submenu} ${pageTitle}`;
    switch (pageName) {
      case "Organization Profile":
        return <OrgBasics />;
      case "Organization Branding":
        return <OrgBranding />;
      case "Organization Templates":
        return <OrgTemplate />;
      case "Organization Users":
        return <OrgUsers />;
      case "Organization Projects":
        return <Projects />;
      case "Organization Emails":
        return <OrgEmailTemplate />;
      default:
        return null;
    }
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    orgAdmin: state.user.orgAdmin,
  };
};

export default connect(mapStateToProps, { getOrganization })(AdminDashboard);
