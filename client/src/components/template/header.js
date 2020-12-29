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
import { Modal, Avatar, Menu, Dropdown, Input, Badge, Button } from "antd";
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  BellOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { deleteUser } from "../../actions";
import { totalSearch } from "../../actions/search";
import { hideAnnounce } from "../../actions/announce";
import { Link } from "react-router-dom";
import sampleUrl from "../../assets/img/user-avatar.png";
import SecrityQuestion from "./question_form";
import logoUrl from "../../assets/img/home-logo.png";
import { getOneFieldData } from "../../utils/helper";

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
      showDrawer: false,
    };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  showDrawer = () => {
    this.setState({ showDrawer: true });
  };

  onCloseDrawer = () => {
    this.setState({ showDrawer: false });
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

  onSearch = async (searchTxt) => {
    try {
      const res = await this.props.totalSearch(searchTxt);
      this.setState({
        projects: res.projects || [],
        challenges: res.challenges || [],
        organizations: res.organizations || [],
        participants: res.participants || [],
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  menu = () => {
    const { projects, challenges, organizations, participants } = this.state;
    return (
      <Menu className="search-menu">
        <div className="mt-1 px-2">
          <Input.Search
            placeholder="Search..."
            onSearch={this.onSearch}
            style={{ width: "100%", minWidth: 300, marginBottom: 5 }}
          />
        </div>

        {organizations.length > 0 && (
          <React.Fragment>
            <div className="mt-1 px-2">
              <h5>{this.props.label.titleOrganization}</h5>
            </div>
            {organizations.map((org) => (
              <Menu.Item key={org._id}>
                <Link to={`/organization/${org._id}`}>{org.org_name}</Link>
              </Menu.Item>
            ))}
            <Menu.Divider />
          </React.Fragment>
        )}

        {challenges.length > 0 && (
          <React.Fragment>
            <div className="mt-1 px-2">
              <h5>{this.props.label.titleChallenge}</h5>
            </div>
            {challenges.map((chl) => (
              <Menu.Item key={chl._id}>
                <Link to={`/challenge/${chl._id}`}>{chl.challenge_name}</Link>
              </Menu.Item>
            ))}
            <Menu.Divider />
          </React.Fragment>
        )}

        {projects.length > 0 && (
          <React.Fragment>
            <div className="mt-1 px-2">
              <h5>{this.props.label.titleProject}</h5>
            </div>
            {projects.map((proj) => (
              <Menu.Item key={proj._id}>
                <Link to={`/project/${proj._id}`}>{proj.name}</Link>
              </Menu.Item>
            ))}
            <Menu.Divider />
          </React.Fragment>
        )}

        {participants.length > 0 && (
          <React.Fragment>
            <div className="mt-1 px-2">
              <h5>{this.props.label.titleParticipant}</h5>
            </div>
            {participants.map((part) => (
              <Menu.Item key={part._id}>
                <Link
                  to={`/participant/${part._id}`}
                >{`${part.profile.first_name} ${part.profile.last_name}`}</Link>
              </Menu.Item>
            ))}
          </React.Fragment>
        )}
      </Menu>
    );
  };

  render = () => {
    const {
      authenticated,
      currentUser,
      logo,
      loginMode,
      currentOrg,
      message,
      notification,
      isAdmin,
      fields,
      announce,
      hideAnnounce,
      label,
    } = this.props;
    let centerLogo =
      logo ||
      "https://hackathon-cretech.s3.us-east-2.amazonaws.com/7e68ac9b-cc75-4d15-a8e1-a07a9e48bc90.png";
    const showGallery = !!getOneFieldData(fields.fieldData, "show_gallery");
    const showProject = !!getOneFieldData(fields.fieldData, "show_project");

    return (
      <React.Fragment>
        {announce.announce._id && announce.show && (
          <div className="header-announce">
            <span className="btn-new">New</span>
            <a
              href={announce.announce.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {announce.announce.description}
            </a>
            <Button type="link" onClick={hideAnnounce}>
              <CloseOutlined />
            </Button>
          </div>
        )}

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
                      {label.titleOrganization}s
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/participants">
                      {label.titleParticipant}s
                    </Link>
                  </NavItem>
                )}
                {authenticated && fields.mentor && (
                  <NavItem>
                    <Link className="nav-link" to="/mentors">
                      Mentors
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/challenges">
                      {label.titleChallenge}s
                    </Link>
                  </NavItem>
                )}
                {authenticated && showProject && (
                  <NavItem>
                    <Link className="nav-link" to="/projects">
                      {label.titleProject}s
                    </Link>
                  </NavItem>
                )}
                {showGallery && (
                  <NavItem>
                    <Link className="nav-link" to="/gallery">
                      {label.titleGallery}
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/message">
                      <Badge
                        count={message.unread}
                        style={{ backgroundColor: "#52c41a" }}
                      >
                        <span>Message</span>
                      </Badge>
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <NavItem>
                    <Link className="nav-link" to="/help">
                      Resources
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
                  <NavItem>
                    <Link className="nav-link" to="#">
                      <Dropdown
                        overlay={this.menu}
                        trigger={["click"]}
                        placement="bottomRight"
                      >
                        <div
                          className="mr-2"
                          style={{
                            fontSize: 22,
                          }}
                        >
                          <SearchOutlined />
                        </div>
                      </Dropdown>
                    </Link>
                  </NavItem>
                )}
                {authenticated && (
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      {loginMode === 0 && currentUser.profile && (
                        <React.Fragment>
                          <Avatar
                            src={currentUser.profile.photo || sampleUrl}
                          />{" "}
                          &nbsp;
                          {`${currentUser.profile.first_name} ${currentUser.profile.last_name}`}
                        </React.Fragment>
                      )}
                      {loginMode === 1 && currentOrg.org_name && (
                        <React.Fragment>
                          <Avatar src={currentOrg.logo || sampleUrl} /> &nbsp;
                          {currentOrg.org_name}
                        </React.Fragment>
                      )}
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        <Link
                          className="nav-link"
                          to={loginMode === 1 ? "/org-profile" : "/profile"}
                        >
                          Profile
                        </Link>
                      </DropdownItem>
                      {loginMode === 0 && (
                        <DropdownItem>
                          <Link
                            className="nav-link"
                            to="#"
                            onClick={this.showDrawer}
                          >
                            Security Question
                          </Link>
                        </DropdownItem>
                      )}
                      {loginMode === 0 && (
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
                      )}
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
          <SecrityQuestion
            visible={this.state.showDrawer}
            onCloseDrawer={this.onCloseDrawer}
          />
        </div>
      </React.Fragment>
    );
  };
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    loginMode: state.auth.loginMode,
    currentUser: state.user.profile,
    isAdmin: state.user.isAdmin,
    currentOrg: state.organization.authOrg,
    message: state.message,
    notification: state.notification,
    fields: state.profile,
    announce: state.announce,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  deleteUser,
  totalSearch,
  hideAnnounce,
})(HeaderTemplate);
