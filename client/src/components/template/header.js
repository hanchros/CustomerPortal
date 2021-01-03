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
import logoUrl from "../../assets/img/home-logo.png";

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
      logo,
      notification,
      isAdmin,
    } = this.props;
    let centerLogo =
      logo ||
      "https://hackathon-cretech.s3.us-east-2.amazonaws.com/7e68ac9b-cc75-4d15-a8e1-a07a9e48bc90.png";

    return (
      <React.Fragment>
        <div className={`main-nav ${isAdmin && "admin-nav"}`}>
          <Navbar
            className="container-nav"
            light
            color="transparent"
            expand="md"
          >
            <Link className="navbar-brand" to={"/user-dashboard"}>
              <img src={logoUrl} height="43" alt="logo" />
            </Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="mr-auto" navbar>
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to={"/user-dashboard"}>
                      Dashboard
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/organizations">
                      Organizations
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/participants">
                      Participants
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/projects">
                      Projects
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/invite">
                      Invite Users
                    </Link>
                  </NavItem>
                )}
                {authenticated && isAdmin && (
                  <NavItem>
                    <Link className="nav-link" to="/admin">
                      Admin
                    </Link>
                  </NavItem>
                )}
              </Nav>
              <Nav navbar>
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/notification">
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
                      <DropdownItem>
                        <Link
                          className="nav-link"
                          to="#"
                          onClick={() =>
                            this.handleOnClickDelete(this.props.deleteUser)
                          }
                        >
                          Delete Account
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
          {this.props.logo && (
            <div className="page-logo pt-4 pb-4 text-center">
              <img src={centerLogo} height="50px" alt="logo" />
            </div>
          )}
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
    notification: state.notification,
  };
}

export default connect(mapStateToProps, {
  deleteUser,
})(HeaderTemplate);
