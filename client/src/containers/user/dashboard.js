import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import { Avatar, Tag, Alert, Skeleton } from "antd";
import {
  updateProject,
  getProjectsByUser,
  listProjectByCreator,
  getParticipant,
} from "../../actions/project";
import { Header, Footer, CustomCard } from "../../components/template";
import sampleUrl from "../../assets/img/user-avatar.png";
import ProjectAvatar from "../../assets/icon/challenge.png";
import CreateForm from "../../components/project/create_project";
import UserTags from "./user-tag";
import QuestionForm from "../../components/template/question_form";
import AttrBlock from "../../components/pages/attr-block";
import { getOneFieldData } from "../../utils/helper";

class UserDashboard extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      joinProjects: [],
      createdProjects: [],
      loading: false,
      isUpdate: false,
      avatarURL: "",
      curProject: {},
      showDrawer: false,
    };
  }

  componentDidMount = async () => {
    const { getProjectsByUser, listProjectByCreator } = this.props;
    this.setState({ loading: true });
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    this._isMounted = true;

    const joinProjects = await getProjectsByUser(userId);
    const createdProjects = await listProjectByCreator(userId);
    if (!this._isMounted) return;
    this.setState({
      joinProjects: joinProjects || [],
      createdProjects: createdProjects || [],
      loading: false,
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleUpdate = (curProject) => {
    this.setState({ isUpdate: true, curProject });
  };

  hideProjectCreate = async (project) => {
    const { createdProjects } = this.state;
    if (!project) {
      this.setState({ isUpdate: false });
      return;
    }
    let newPros = createdProjects;
    for (let i = 0; i < newPros.length; i++) {
      if (newPros[i]._id === project._id) newPros[i] = project;
    }
    this.setState({ createdProjects: newPros, isUpdate: false });
  };

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  showDrawer = () => {
    this.setState({ showDrawer: true });
  };

  onCloseDrawer = () => {
    this.setState({ showDrawer: false });
  };

  render = () => {
    const { isUpdate, avatarURL, curProject, showDrawer } = this.state;
    const { user, label, updateProject, fieldData } = this.props;
    const userInfo = user.profile;
    const dashIntro = getOneFieldData(fieldData, "dash_intro");

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          {isUpdate && (
            <div className="login-page">
              <h4 className="mt-3 mb-4">Create {label.titleProject}</h4>
              <CreateForm
                updateProject={updateProject}
                hideProjectCreate={this.hideProjectCreate}
                setAvatar={this.setAvatar}
                avatarURL={avatarURL || curProject.logo}
                curProject={curProject}
                fieldData={fieldData}
                label={label}
              />
            </div>
          )}
          {!isUpdate && (
            <div className="user-dashboard">
              {this.renderProfileAlert(userInfo)}
              {this.renderMessageAlert()}
              {this.renderSQAlert()}
              {dashIntro && (
                <div
                  className="sun-editor-editable mb-4"
                  dangerouslySetInnerHTML={{ __html: dashIntro }}
                />
              )}
              {this.renderUserInfo(userInfo)}
              {this.renderCreatedProjects()}
              {this.renderMemberProjects()}
              {this.renderFollowingProjects()}
            </div>
          )}
        </Container>
        <Footer />
        <QuestionForm visible={showDrawer} onCloseDrawer={this.onCloseDrawer} />
      </React.Fragment>
    );
  };

  renderProfileAlert = (userInfo) => {
    if (!userInfo) return null;
    let message = [];
    if (!userInfo.photo) message.push("photo");
    if (!userInfo.org_name) message.push("organization");
    if (message.length === 0) return null;
    const valid = (
      <div className="profile-alert">
        {this.props.label.titleParticipant} Profile has not been completed!
        &nbsp;&nbsp; Click <Link to="/profile">here</Link> to update your
        profile
      </div>
    );
    return <Alert description={valid} type="info" closable />;
  };

  renderMessageAlert = () => {
    const { joinProjects } = this.state;
    let invPros = [];
    joinProjects.map((jpm) => {
      if (jpm.pending) {
        invPros.push(jpm.project);
      }
      return false;
    });
    if (invPros.length === 0) return null;
    return (
      <React.Fragment>
        {invPros.map((proj) => {
          let valid = (
            <div className="profile-alert">
              A {this.props.label.project} - "{proj.name}" has invited you to
              join the team. Click <Link to={`/project/${proj._id}`}>here</Link>{" "}
              to accept invitation
            </div>
          );
          return <Alert description={valid} type="success" closable />;
        })}
      </React.Fragment>
    );
  };

  renderSQAlert = () => {
    const { question } = this.props;
    if (question.securityquestion._id) return null;
    const valid = (
      <div className="profile-alert">
        {this.props.label.titleParticipant} security questions have not been
        set! Click{" "}
        <Link to="#" onClick={this.showDrawer}>
          here
        </Link>{" "}
        to set your security questions
      </div>
    );
    return <Alert description={valid} type="info" closable />;
  };

  renderUserInfo = (userInfo) => {
    if (!userInfo) {
      return this.renderSpin();
    }
    return (
      <Row>
        <Col xl={4} md={5} className="mb-3">
          <div className="user-card">
            <Avatar src={userInfo.photo || sampleUrl} size={200} />
          </div>
          <div className="dashboard-invite">
            <Link to="/invite" className="main-btn">Send Invitation</Link>
          </div>
        </Col>
        <Col xl={8} md={7}>
          <h3>
            {userInfo.first_name} {userInfo.last_name}
          </h3>
          <h5 className="m-0">{userInfo.org_name}</h5>
          <h5>{userInfo.country}</h5>
          <div
            className="sun-editor-editable"
            dangerouslySetInnerHTML={{ __html: userInfo.personal_statement }}
          />
          <div className="social-icon d-flex">
            {userInfo.facebook && (
              <a
                href={userInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={require("../../assets/icon/facebook.png")}
                  alt="facebook"
                />
              </a>
            )}
            {userInfo.twitter && (
              <a
                href={userInfo.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={require("../../assets/icon/twitter.png")}
                  alt="twitter"
                />
              </a>
            )}
            {userInfo.linkedin && (
              <a
                href={userInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={require("../../assets/icon/linkedin.png")}
                  alt="linkedin"
                />
              </a>
            )}
            {userInfo.web && (
              <a href={userInfo.web} target="_blank" rel="noopener noreferrer">
                <img
                  src={require("../../assets/icon/challenge.png")}
                  alt="web"
                />
              </a>
            )}
          </div>
          <UserTags tags={userInfo.tags} contact={userInfo.contact} />
          <AttrBlock
            fieldData={this.props.fieldData}
            fieldName={"userform_attr"}
            attr={userInfo.attr}
          />
        </Col>
      </Row>
    );
  };

  renderCreatedProjects = () => {
    const { createdProjects } = this.state;
    const { label } = this.props;
    if (createdProjects.length === 0) return null;

    return (
      <React.Fragment>
        <h5 className="mt-5">{label.titleProject} Created</h5>
        {this.renderSpin()}
        <Row>
          {createdProjects.map((item, index) => (
            <Col key={index} lg={4} md={6} sm={12}>
              <Link className="card-link" to={`/project/${item._id}`}>
                <CustomCard
                  logo={item.logo || ProjectAvatar}
                  title={item.name}
                  description={item.short_description}
                  status="In Progress"
                  likes={item.likes ? item.likes.length : 0}
                />
              </Link>
              <div className="edit-chal">
                <Tag color="purple" onClick={() => this.handleUpdate(item)}>
                  Edit {label.titleProject}
                </Tag>
              </div>
            </Col>
          ))}
        </Row>
      </React.Fragment>
    );
  };

  renderMemberProjects = () => {
    const { joinProjects } = this.state;
    const listItem = joinProjects.filter((item) => item.member === true);
    if (listItem.length === 0) return null;

    return (
      <React.Fragment>
        <h5 className="mt-5">{this.props.label.titleProject} Team Member</h5>
        {this.renderSpin()}
        <Row>
          {listItem.map((item, index) => {
            return (
              <Col key={index} lg={4} md={6} sm={12}>
                <Link className="card-link" to={`/project/${item.project._id}`}>
                  <CustomCard
                    logo={item.project.logo || ProjectAvatar}
                    title={item.project.name}
                    description={item.project.short_description}
                    status="In Progress"
                  />
                </Link>
              </Col>
            );
          })}
        </Row>
      </React.Fragment>
    );
  };

  renderFollowingProjects = () => {
    const { joinProjects } = this.state;
    const listItem = joinProjects.filter((item) => item.member !== true);
    if (listItem.length === 0) return null;

    return (
      <React.Fragment>
        <h5 className="mt-5">{this.props.label.titleProject} Followed</h5>
        {this.renderSpin()}
        <Row>
          {listItem.map((item, index) => {
            return (
              <Col key={index} lg={4} md={6} sm={12}>
                <Link className="card-link" to={`/project/${item.project._id}`}>
                  <CustomCard
                    logo={item.project.logo || ProjectAvatar}
                    title={item.project.name}
                    description={item.project.short_description}
                    status="In Progress"
                  />
                </Link>
              </Col>
            );
          })}
        </Row>
      </React.Fragment>
    );
  };

  renderSpin = () => {
    return (
      <Row>
        <Col className="center">
          <Skeleton active loading={this.state.loading} />
        </Col>
      </Row>
    );
  };
}
const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    question: state.question,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
};

export default connect(mapStateToProps, {
  getProjectsByUser,
  listProjectByCreator,
  updateProject,
  getParticipant,
})(UserDashboard);
