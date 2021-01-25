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
import { Modal, Avatar, Badge } from "antd";
import { ExclamationCircleOutlined, BellOutlined } from "@ant-design/icons";
import { deleteUser } from "../../actions/user";
import { Link } from "react-router-dom";
import sampleUrl from "../../assets/img/user-avatar.png";

const { confirm } = Modal;

class HeaderTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      projects: [],
      challenges: [],
      organizations: [],
      participants: [],
    };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleOnClickDelete = (deleteUser) => {
    const { currentUser } = this.props;
    confirm({
      title: "Do you want to delete your account?",
      icon: <ExclamationCircleOutlined />,
      content: "",
      onOk() {
        deleteUser(currentUser._id);
      },
    });
  };

  render = () => {
    const {
      authenticated,
      currentUser,
      notification,
      isAdmin,
      orgAdmin,
      organization,
    } = this.props;
    const orgSettings = organization.orgSettings;

    return (
      <React.Fragment>
        <div
          className="main-nav"
          style={{
            backgroundColor: orgSettings.secondary_color,
          }}
        >
          <Navbar
            className="container-nav"
            light
            color="transparent"
            expand="md"
          >
            <Link className="navbar-brand" to={"/dashboard"}>
              {currentUser.profile && currentUser.profile.org.logo ? (
                <img src={currentUser.profile.org.logo} alt="logo" />
              ) : (
                "HOME"
              )}
            </Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse
              isOpen={this.state.isOpen}
              navbar
              style={{ color: orgSettings.menufont_color }}
            >
              <Nav className="mr-auto" navbar>
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/projects">
                      MY PROJECTS
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/messages">
                      MESSAGES
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/techhub">
                      TECH HUB
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/learnhub">
                      LEARN
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/faq">
                      FAQ
                    </Link>
                  </NavItem>
                )}
                {orgAdmin && (
                  <NavItem>
                    <Link className="nav-link" to="/admin">
                      ADMIN
                    </Link>
                  </NavItem>
                )}
                {isAdmin && (
                  <NavItem>
                    <Link className="nav-link" to="/super">
                      SUPER
                    </Link>
                  </NavItem>
                )}
              </Nav>
              <Nav navbar>
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link notif" to="/notification">
                      <div
                        className="mr-2"
                        style={{
                          fontSize: 22,
                        }}
                      >
                        <Badge
                          count={notification.unread}
                          style={{ backgroundColor: "#f5222d" }}
                        >
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
                        <Link className="nav-link" to={"/profile"}>
                          Profile
                        </Link>
                      </DropdownItem>
                      {/* <DropdownItem>
                        <Link
                          className="nav-link"
                          to="#"
                          onClick={() =>
                            this.handleOnClickDelete(this.props.deleteUser)
                          }
                        >
                          Delete Account
                        </Link>
                      </DropdownItem> */}
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
    organization: state.organization,
  };
}

export default connect(mapStateToProps, {
  deleteUser,
})(HeaderTemplate);
