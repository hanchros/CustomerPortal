import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Avatar, Skeleton, Button, Modal, Input } from "antd";
import {
  EditOutlined,
  FacebookFilled,
  LinkedinFilled,
  TwitterCircleFilled,
} from "@ant-design/icons";
import { Header, Footer, SubHeader } from "../../components/template";
import OrgLogo from "../../assets/icon/challenge.png";
import UserAvatar from "../../assets/img/user-avatar.png";
import { fetchUser, listUserProjects } from "../../actions/user";
import { getProject } from "../../actions/project";
import { startConversation, fetchOneConversation } from "../../actions/message";
import history from "../../history";
import { Link } from "react-router-dom";

class UserDashboard extends Component {
  constructor() {
    super();

    this.state = {
      user: {},
      projects: [],
      loading: false,
      curProj: "",
      visible: false,
      chatText: "",
      chosenParticipantId: "",
    };
  }

  componentDidMount = async () => {
    const {
      match,
      fetchUser,
      listUserProjects,
      location,
      getProject,
    } = this.props;
    const params = new URLSearchParams(location.search);
    let user_id = match.params.user_id;
    const projId = params.get("project");
    this.setState({ loading: true });
    let user = await fetchUser(user_id);
    let projects = await listUserProjects(user_id);
    let curProj;
    if (projId) {
      curProj = await getProject(projId);
    }
    this.setState({ projects, user, loading: false, projId, curProj });
  };

  haveChat = (participantId) => {
    let conversations = this.props.message.conversations;
    for (let cv of conversations) {
      if (cv.participants.length > 2) continue;
      let filters = cv.participants.filter((pt) => pt._id === participantId);
      if (filters.length > 0) return true;
    }
    return false;
  };

  toggleModal = async (ptId) => {
    if (ptId && this.haveChat(ptId)) {
      await this.props.fetchOneConversation(ptId);
      history.push("/messages");
      return;
    }
    this.setState({ visible: !this.state.visible, chosenParticipantId: ptId });
  };

  onChangeChat = (e) => {
    this.setState({ chatText: e.target.value });
  };

  handleOk = () => {
    const { chatText, chosenParticipantId } = this.state;
    if (!chatText || !chosenParticipantId) return;
    this.props.startConversation({
      recipient: chosenParticipantId,
      composedMessage: chatText,
    });
    this.toggleModal();
  };

  goToProject = (item) => {
    history.push(`/project/${item._id}`);
  };

  render() {
    const { projects, user, loading, curProj, visible, chatText } = this.state;
    const profile = user.profile || {};
    const me = this.props.user;
    const curOrg = this.props.organization.currentOrganization;
    let isSameOrg = false;
    if (me.profile && profile.org)
      isSameOrg = me.profile.org._id === profile.org._id;

    return (
      <React.Fragment>
        <Header />
        {curProj && <SubHeader org_name={curOrg.org_name} project={curProj} />}
        <Container className="content">
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          <div className="user-header">
            <h5>
              {profile.first_name} {profile.last_name}
            </h5>
            {user._id !== me._id && (
              <Button
                type="ghost"
                className="black-btn"
                onClick={() => this.toggleModal(user._id)}
              >
                <EditOutlined /> initiate chat
              </Button>
            )}
          </div>
          <Row className="mt-4">
            <Col md={8}>
              <Row>
                <Col md={6}>
                  <div className="user-span">
                    <p>Organization</p>
                    <Link to={`/${profile.org_name}`}>{profile.org_name}</Link>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="user-span">
                    <p>Role in organization</p>
                    {profile.role}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="user-span">
                    <p>Email</p>
                    {user.email}
                  </div>
                </Col>
                <Col md={6}>
                  {profile.phone && (
                    <div className="user-span">
                      <p>Phone</p>
                      {profile.phone}
                    </div>
                  )}
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  {profile.contact && (
                    <div className="user-span">
                      <p>Best way to contact this person</p>
                      <span>{profile.contact}</span>
                    </div>
                  )}
                  {profile.country && (
                    <div className="user-span">
                      <p>Country</p>
                      <span>{profile.country}</span>
                    </div>
                  )}
                  {profile.address && (
                    <div className="user-span">
                      <p>Address</p>
                      <span>{profile.address}</span>
                    </div>
                  )}
                </Col>
              </Row>
            </Col>
            <Col md={4} className="mb-4 user-logo-box">
              <div className="user-detail-logo">
                <img src={profile.photo || UserAvatar} alt="logo" />
                <div className="profile-links">
                  {profile.facebook && (
                    <a
                      href={profile.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FacebookFilled />
                    </a>
                  )}
                  {profile.twitter && (
                    <a
                      href={profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TwitterCircleFilled />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedinFilled />
                    </a>
                  )}
                </div>
                {profile.web && (
                  <div className="profile-web">
                    <a
                      href={profile.web}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.web}
                    </a>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          {isSameOrg && (
            <Row>
              <Col>
                <p className="mt-5">
                  <b>Projects</b>
                </p>
                <hr />
                <div className="projects-table-header">
                  <span />
                  <span>name</span>
                  <span>leader</span>
                  <span>organization</span>
                  <span></span>
                </div>
                {projects.map((proj) => (
                  <div
                    className="project-table-item"
                    key={proj._id}
                    onClick={() => this.goToProject(proj)}
                  >
                    <div className="cell0">
                      <Avatar src={proj.logo || OrgLogo} />
                    </div>
                    <div className="cell0">
                      <p>
                        <b>{proj.name}</b>
                      </p>
                      <span>{proj.objective}</span>
                    </div>
                    <div className="cell0">
                      {proj.participant.profile.first_name}{" "}
                      {proj.participant.profile.last_name}
                    </div>
                    <div className="cell0">
                      {proj.participant.profile.org_name}
                    </div>
                    <div className="cell0"></div>
                  </div>
                ))}
              </Col>
            </Row>
          )}
          {visible && (
            <Modal
              title={`Open Chat room with team member`}
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.toggleModal}
            >
              <Input.TextArea
                rows={2}
                onChange={this.onChangeChat}
                value={chatText}
                placeholder="Message"
                size="large"
              />
            </Modal>
          )}
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    project: state.project,
    organization: state.organization,
    message: state.message,
  };
}

export default connect(mapStateToProps, {
  fetchUser,
  listUserProjects,
  getProject,
  startConversation,
  fetchOneConversation,
})(UserDashboard);
