import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Avatar, Badge } from "antd";
import { BellOutlined, MessageOutlined } from "@ant-design/icons";
import { deleteUser } from "../../actions/user";
import { Link } from "react-router-dom";
import sampleUrl from "../../assets/img/user-avatar.png";

class HeaderTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render = () => {
    const {
      authenticated,
      currentUser,
      notification,
      isAdmin,
      orgAdmin,
      message,
    } = this.props;

    const path = window.location.pathname;
    return (
      <React.Fragment>
        <div className="main-nav">
          <Navbar
            className="container-nav"
            light
            color="transparent"
            expand="md"
          >
            <Link
              className="navbar-brand"
              to={authenticated ? "/dashboard" : "/"}
            >
              {currentUser.profile && currentUser.profile.org.logo ? (
                <img src={currentUser.profile.org.logo} alt="logo" />
              ) : (
                "HOME"
              )}
            </Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="mr-auto" navbar>
                {authenticated && (
                  <NavItem>
                    <Link
                      className={`nav-link ${
                        path === "/dashboard" ? "active" : ""
                      }`}
                      to={`/dashboard`}
                    >
                      DASHBOARD
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link
                      className={`nav-link ${
                        path === "/techhub" ? "active" : ""
                      }`}
                      to={`/techhub`}
                    >
                      TECHHUB
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link
                      className={`nav-link ${
                        path === "/learnhub" ? "active" : ""
                      }`}
                      to={`/learnhub`}
                    >
                      LEARN
                    </Link>
                  </NavItem>
                )}
                {orgAdmin && (
                  <NavItem>
                    <Link
                      className={`nav-link ${
                        path === "/admin" ? "active" : ""
                      }`}
                      to={`/admin`}
                    >
                      ADMIN
                    </Link>
                  </NavItem>
                )}
                {isAdmin && (
                  <NavItem>
                    <Link
                      className={`nav-link ${
                        path === "/super" ? "active" : ""
                      }`}
                      to="/super"
                    >
                      SUPER
                    </Link>
                  </NavItem>
                )}
              </Nav>
              <Nav navbar>
                {authenticated && (
                  <NavItem>
                    <Link
                      className={`nav-link ${
                        path === "/messages" ? "active" : ""
                      }`}
                      to="/messages"
                    >
                      <div className="mr-2">
                        <Badge count={message.unread}>
                          <MessageOutlined />
                        </Badge>
                      </div>
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link
                      className={`nav-link notif ${
                        path === "/notification" ? "active" : ""
                      }`}
                      to="/notification"
                    >
                      <div className="mr-2">
                        <Badge count={notification.unread}>
                          <BellOutlined />
                        </Badge>
                      </div>
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      {currentUser.profile && (
                        <React.Fragment>
                          <Avatar
                            src={currentUser.profile.photo || sampleUrl}
                          />{" "}
                          &nbsp;
                          {`${currentUser.profile.first_name} ${currentUser.profile.last_name}`}
                        </React.Fragment>
                      )}
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        <Link className="nav-link" to={"/account"}>
                          My Profile
                        </Link>
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem>
                        <Link className="nav-link" to="/logout">
                          Logout
                        </Link>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                )}
                {!authenticated && (
                  <React.Fragment>
                    <NavItem>
                      <Link className="nav-link" to="/login">
                        Login
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link className="nav-link" to="/register">
                        Register
                      </Link>
                    </NavItem>
                  </React.Fragment>
                )}
              </Nav>
            </Collapse>
          </Navbar>
        </div>
      </React.Fragment>
    );
  };
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    currentUser: state.user.profile,
    isAdmin: state.user.isAdmin,
    orgAdmin: state.user.orgAdmin,
    notification: state.notification,
    message: state.message,
  };
}

export default connect(mapStateToProps, {
  deleteUser,
})(HeaderTemplate);
