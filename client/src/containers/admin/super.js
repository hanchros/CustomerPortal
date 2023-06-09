import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Menu, Breadcrumb, Skeleton } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  ProfileOutlined,
  PicLeftOutlined,
  MailOutlined,
  UsergroupAddOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Header } from "../../components/template";
import { getOrganization } from "../../actions/organization";
import UserAll from "./user/all";
import OrgAll from "./organization/org_report";
import Article from "./article";
import GlobalEmailTemplate from "./setting/email-template";
import SupTemplate from "./template";
import InviteRequests from "./inviteRequest";
import Message from "./user/message";
import SoftwareCompany from "./softcompany";

const { Content, Sider } = Layout;

class AdminDashboard extends Component {
  state = {
    collapsed: false,
    pageTitle: "",
    submenu: "",
  };

  componentDidMount = () => {
    this.setState({
      pageTitle: "Articles",
      submenu: "Super",
    });
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  switchPage = (submenu, pageTitle) => {
    this.setState({ submenu, pageTitle });
  };

  render() {
    const { pageTitle, submenu } = this.state;
    const { isAdmin } = this.props;

    return (
      <React.Fragment>
        <Header />
        <Skeleton active loading={!isAdmin} />
        <Skeleton active loading={!isAdmin} />
        <Skeleton active loading={!isAdmin} />
        {isAdmin && (
          <Layout className="message-box-layout">
            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
            >
              <Menu
                theme="dark"
                defaultSelectedKeys={["articles"]}
                mode="inline"
              >
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
                  key="sup-message"
                  onClick={() => this.switchPage("Super", "Message")}
                >
                  <span>
                    <NotificationOutlined />
                    <span>Messages</span>
                  </span>
                </Menu.Item>
                <Menu.Item
                  key="sup-invite"
                  onClick={() => this.switchPage("Super", "Invite")}
                >
                  <span>
                    <UsergroupAddOutlined />
                    <span>Invite Requests</span>
                  </span>
                </Menu.Item>
                <Menu.Item
                  key="sup-softcompany"
                  onClick={() => this.switchPage("Super", "SoftwareCompany")}
                >
                  <span>
                    <TeamOutlined />
                    <span>Software Company</span>
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
      case "Super Users":
        return <UserAll />;
      case "Super Organization":
        return <OrgAll />;
      case "Super Articles":
        return <Article />;
      case "Super Template":
        return <SupTemplate />;
      case "Super Emails":
        return <GlobalEmailTemplate />;
      case "Super Invite":
        return <InviteRequests />;
      case "Super Message":
        return <Message />;
      case "Super SoftwareCompany":
        return <SoftwareCompany />;
      default:
        return null;
    }
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    isAdmin: state.user.isAdmin,
  };
};

export default connect(mapStateToProps, { getOrganization })(AdminDashboard);
