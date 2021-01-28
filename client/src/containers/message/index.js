import React, { Component } from "react";
import { connect } from "react-redux";
import { Header } from "../../components/template";
import { Layout, Menu, Breadcrumb, Input } from "antd";
import { Link } from "react-router-dom";

const { Content, Sider } = Layout;
const { Search } = Input;

class MessageBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      receptor: "",
      receptorId: "",
      messageText: "",
      curMessageId: "",
      searchTxt: "",
      isTeamChat: false,
      inviteModal: false,
      inviteMembers: [],
    };
  }
  messagesEndRef = React.createRef();

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  onChangeSearch = (e) => {
    this.setState({ searchTxt: e.target.value });
  };

  render() {
    const { receptor, searchTxt, collapsed } = this.state;
    return (
      <React.Fragment>
        <Header />
        <Layout className="message-box">
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <Menu theme="dark" mode="inline">
              <Menu.Item
                className="search-conversation"
                key={"search-conversation"}
              >
                <Search
                  value={searchTxt}
                  onChange={this.onChangeSearch}
                  placeholder="search"
                />
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Content style={{ margin: "0 16px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to={""}>{receptor}</Link>
                </Breadcrumb.Item>
              </Breadcrumb>
              <div className="site-layout-background"></div>
            </Content>
            <div ref={this.messagesEndRef} />
          </Layout>
        </Layout>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    project: state.project,
  };
}

export default connect(mapStateToProps, {})(MessageBox);
