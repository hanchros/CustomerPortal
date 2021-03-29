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
import IntegraLogo from "../../assets/img/logo.png";

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
    const isCompany = !currentUser.role;
    return (
      <React.Fragment>
        <div className="main-nav">
          <Navbar
            className="container-nav"
            light
            color="transparent"
            expand="md"
          >
            {isCompany && (
              <Link
                className="navbar-brand"
                to={authenticated ? "/company-dashboard" : "/"}
              >
                <img src={IntegraLogo} alt="logo" />
              </Link>
            )}
            {!isCompany && (
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
            )}
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="mr-auto" navbar>
                {!isCompany && authenticated && (
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
                {isCompany && authenticated && (
                  <NavItem>
                    <Link
                      className={`nav-link ${
                        path === "/company-dashboard" ? "active" : ""
                      }`}
                      to={`/company-dashboard`}
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
                {!isCompany && authenticated && (
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
                {!isCompany && authenticated && (
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
                      {!isCompany && currentUser.profile && (
                        <React.Fragment>
                          <Avatar
                            src={currentUser.profile.photo || sampleUrl}
                          />{" "}
                          &nbsp;
                          {`${currentUser.profile.first_name} ${currentUser.profile.last_name}`}
                        </React.Fragment>
                      )}
                      {isCompany && currentUser.profile && (
                        <React.Fragment>
                          <Avatar src={currentUser.profile.logo || sampleUrl} />{" "}
                          &nbsp;{currentUser.profile.contact}
                        </React.Fragment>
                      )}
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        {!isCompany && (
                          <Link className="nav-link" to={"/account"}>
                            My Profile
                          </Link>
                        )}
                        {isCompany && (
                          <Link className="nav-link" to={"/company-account"}>
                            Company Profile
                          </Link>
                        )}
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
