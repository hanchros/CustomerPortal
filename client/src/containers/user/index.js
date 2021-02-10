import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Menu, Breadcrumb } from "antd";
import { ProfileOutlined, SketchOutlined } from "@ant-design/icons";
import { Header } from "../../components/template";
import ChangePassword from "./change_password";
import Profile from "./profilepage";

const { Content, Sider } = Layout;

class AdminDashboard extends Component {
  state = {
    collapsed: false,
    pageTitle: "",
    submenu: "",
  };

  componentDidMount() {
    this.setState({
      pageTitle: "Profile",
      submenu: "Account",
    });
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

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
            <Menu theme="dark" defaultSelectedKeys={["profile"]} mode="inline">
              <Menu.Item
                key="profile"
                onClick={() => this.switchPage("Account", "Profile")}
              >
                <span>
                  <ProfileOutlined />
                  <span>Profile</span>
                </span>
              </Menu.Item>
              <Menu.Item
                key="change-password"
                onClick={() => this.switchPage("Account", "ChangePassword")}
              >
                <span>
                  <SketchOutlined />
                  <span>Change Password</span>
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
      </React.Fragment>
    );
  }

  renderPage = () => {
    const { pageTitle, submenu } = this.state;
    let pageName = `${submenu} ${pageTitle}`;
    switch (pageName) {
      case "Account Profile":
        return <Profile />;
      case "Account ChangePassword":
        return <ChangePassword />;
      default:
        return null;
    }
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
  };
};

export default connect(mapStateToProps, {})(AdminDashboard);
