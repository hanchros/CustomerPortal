import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  ProjectOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Header } from "../../components/template";
import history from "../../history";
import UserAll from "./user/all";
import Creators from "./user/creators";
import Message from "./user/message";
import Verify from "./user/unverified";
import Constants from "./constants";
import OrgAll from "./organization/org_report";
import ProjectAll from "./project/project_report";
import HelpDoc from "./help";
import EmailTemplate from "./setting/email-template";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

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
    if (!this.props.isAdmin) {
      history.push("/dashboard");
      return;
    }
  }

  switchPage = (submenu, pageTitle) => {
    this.setState({ submenu, pageTitle });
  };

  render() {
    const { pageTitle, submenu } = this.state;
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
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <UserOutlined />
                    <span>Participant</span>
                  </span>
                }
              >
                <Menu.Item
                  key="pt-all"
                  onClick={() => this.switchPage("Participant", "All")}
                >
                  All
                </Menu.Item>
                <Menu.Item
                  key="proj-own"
                  onClick={() =>
                    this.switchPage("Participant", "Project Owners")
                  }
                >
                  Project Owners
                </Menu.Item>
                <Menu.Item
                  key="pt-msg"
                  onClick={() => this.switchPage("Participant", "Message")}
                >
                  Message
                </Menu.Item>
                <Menu.Item
                  key="pt-vrf"
                  onClick={() => this.switchPage("Participant", "Verify")}
                >
                  Unverified
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <span>
                    <TeamOutlined />
                    <span>Organization</span>
                  </span>
                }
              >
                <Menu.Item
                  key="org-all"
                  onClick={() => this.switchPage("Organization", "All")}
                >
                  All
                </Menu.Item>
              </SubMenu>
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
              {this.props.isSuper && (
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
                  <Menu.Item
                    key="set-help"
                    onClick={() => this.switchPage("Setting", "Help")}
                  >
                    Help Setting
                  </Menu.Item>
                  <Menu.Item
                    key="email-template"
                    onClick={() => this.switchPage("Setting", "Email")}
                  >
                    Email Templates
                  </Menu.Item>
                </SubMenu>
              )}
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
      case "Participant All":
        return <UserAll />;
      case "Participant Project Owners":
        return <Creators />;
      case "Participant Message":
        return <Message />;
      case "Participant Verify":
        return <Verify />;
      case "Organization All":
        return <OrgAll />;
      case "Project All":
        return <ProjectAll />;
      case "Setting Constants":
        return <Constants />;
      case "Setting Help":
        return <HelpDoc />;
      case "Setting Email":
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
  };
};

export default connect(mapStateToProps, {})(AdminDashboard);
