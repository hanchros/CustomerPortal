import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinIcon,
  LinkedinShareButton,
} from "react-share";
import { Container, Row, Col } from "reactstrap";
import { Tag, Modal, Tooltip, Skeleton, message } from "antd";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import { Header, Footer, CustomCard } from "../../components/template";
import { getChallenge, upvoteChallenge } from "../../actions/challenge";
import {
  updateProject,
  createProject,
  challengeProjects,
} from "../../actions/project";
import { listChallengeComment } from "../../actions/comment";
import ProjectAvatar from "../../assets/icon/challenge.png";
import ShareIcon from "../../assets/icon/share.png";
import CreateForm from "../../components/project/create_project";
import Tags from "../../components/pages/tags";
import Comments from "../../components/project/challenge_comment";

class Challenge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCreate: false,
      challenge: {},
      projects: [],
      avatarURL: "",
      curProject: {},
      loading: false,
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    const id = this.props.match.params.id;
    const challenge = await this.props.getChallenge(id);
    const projects = await this.props.challengeProjects(id);
    await this.props.listChallengeComment(id);
    this.setState({ challenge, projects, loading: false });
  };

  handleUpvote = async (vote) => {
    const { loginMode, label } = this.props;
    if (loginMode !== 0) {
      message.warn(
        `Only ${label.participant} can upvote the ${label.challenge}`
      );
      return;
    }
    const { getChallenge, upvoteChallenge, match } = this.props;
    await upvoteChallenge(match.params.id, vote);
    const challenge = await getChallenge(match.params.id);
    this.setState({ challenge });
  };

  handleCreate = () => {
    if (this.props.user.role === "Restrict") {
      message.warn(`You are not allowed to create ${this.props.label.project}`);
      return;
    }
    this.setState({
      isCreate: true,
      curProject: {
        participant: this.props.user._id,
        challenge: this.props.match.params.id,
      },
      isModalOpen: false,
    });
  };

  handleUpdate = (curProject) => {
    this.setState({ isCreate: true, curProject });
  };

  hideProjectCreate = async (project) => {
    const { projects, curProject } = this.state;
    if (!project) {
      this.setState({ isCreate: false });
      return;
    }
    let newPros = projects;
    if (!curProject._id) {
      newPros = [...projects, project];
    } else {
      for (let i = 0; i < newPros.length; i++) {
        if (newPros[i]._id === project._id) newPros[i] = project;
      }
    }
    this.setState({ projects: newPros, isCreate: false });
  };

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  handleClickShare = (isModalOpen) => {
    this.setState({ isModalOpen });
  };

  checkIsCreator = () => {
    const { challenge } = this.state;
    const { authOrg, user } = this.props;
    if (challenge.organization)
      return challenge.organization._id === authOrg._id;
    if (challenge.participant) return challenge.participant._id === user._id;
    return false;
  };

  render = () => {
    const { isCreate, avatarURL, curProject, loading } = this.state;
    const {
      createProject,
      updateProject,
      label,
      fieldData,
      match,
    } = this.props;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          {isCreate ? (
            <div className="login-page">
              <h4 className="mt-3 mb-4">Create {label.titleProject}</h4>
              <CreateForm
                createProject={createProject}
                updateProject={updateProject}
                hideProjectCreate={this.hideProjectCreate}
                setAvatar={this.setAvatar}
                avatarURL={avatarURL || curProject.logo}
                curProject={curProject}
                fieldData={fieldData}
                label={label}
              />
            </div>
          ) : (
            <div className="user-dashboard list-view">
              {this.renderChallengeInfo()}
              {!loading && <Comments challengeId={match.params.id} />}
              {this.renderProjects()}
            </div>
          )}
        </Container>
        <Footer />
      </React.Fragment>
    );
  };

  renderChallengeInfo = () => {
    const { challenge, loading } = this.state;
    const { loginMode, user, fieldData, label } = this.props;
    if (loading || !challenge._id) {
      return (
        <Row>
          <Skeleton active loading={loading} />
        </Row>
      );
    }
    if (!challenge.likes) challenge.likes = [];
    const isVoter = loginMode === 0 && challenge.likes.includes(user._id);

    return (
      <Row>
        <Col xl={4} md={5} className="mb-3">
          <div className="project-card">
            <div className="avatar-img">
              <img src={challenge.logo || ProjectAvatar} alt="logo" />
            </div>
          </div>
          <div className="flex mt-2" style={{ width: "100%" }}>
            <div className="share-btn mr-auto">
              <Tooltip
                placement="right"
                title={`Share this ${label.titleChallenge}`}
              >
                <img
                  src={ShareIcon}
                  alt="share"
                  width="50px"
                  height="50px"
                  onClick={() => this.handleClickShare(true)}
                />
              </Tooltip>
            </div>
            <div className="challenge-creator">
              <span className="mr-2">Created By</span>
              {challenge.organization && (
                <Link to={`/organization/${challenge.organization._id}`}>
                  <img
                    src={challenge.organization.logo || ProjectAvatar}
                    alt=""
                    title={challenge.organization.org_name}
                  />
                </Link>
              )}
              {challenge.participant && (
                <Link to={`/participant/${challenge.participant._id}`}>
                  <img
                    src={challenge.participant.profile.photo || ProjectAvatar}
                    alt=""
                    title={challenge.participant.profile.first_name}
                  />
                </Link>
              )}
            </div>
          </div>

          <Modal
            title={`Share current ${label.challenge}`}
            centered
            visible={this.state.isModalOpen}
            footer={null}
            onOk={() => this.handleClickShare(false)}
            onCancel={() => this.handleClickShare(false)}
          >
            {this.renderModalChallengeInfo(challenge)}
          </Modal>
        </Col>
        <Col xl={8} md={7}>
          <h3>{challenge.challenge_name}</h3>
          <b>Short Description</b>
          <p>{challenge.short_description}</p>
          <b>Geography</b>
          <p>{challenge.geography}</p>
          <b>Who will this {label.challenge} benefit?</b>
          <p>{challenge.benefit}</p>
          <b>Stakeholders</b>
          <p>{challenge.stackholders}</p>
          <b>Keywords</b>
          <p>{challenge.keywords}</p>
          <b>Description</b>
          <div
            className="sun-editor-editable"
            dangerouslySetInnerHTML={{ __html: challenge.description }}
          />
          <Tags
            fieldData={fieldData}
            tags={challenge.tags || []}
            prefix={"challenge"}
          />
          <div className="flex mt-4">
            <p>
              {isVoter && (
                <Link to="#" onClick={() => this.handleUpvote(false)}>
                  <LikeFilled />
                </Link>
              )}
              {!isVoter && (
                <Link to="#" onClick={() => this.handleUpvote(true)}>
                  <LikeOutlined />
                </Link>
              )}
              <span> {challenge.likes.length}</span>
            </p>
          </div>
        </Col>
      </Row>
    );
  };

  renderModalChallengeInfo = (challenge) => {
    const shareURL = `${process.env.REACT_APP_API_HOST}/public/challenge/${challenge._id}`;
    return (
      <Row>
        <Col xl={4} md={6} className="mb-3">
          <div className="project-card">
            <div className="avatar-img">
              <img src={challenge.logo || ProjectAvatar} alt="logo" />
            </div>
          </div>
        </Col>
        <Col xl={8} md={6}>
          <h3>{challenge.challenge_name}</h3>
          <p>{challenge.short_description}</p> <br />
          <div
            className="sun-editor-editable"
            dangerouslySetInnerHTML={{ __html: challenge.description }}
          />
          <TwitterShareButton className="mr-2" url={shareURL}>
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>
          <FacebookShareButton className="mr-2" url={shareURL}>
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
          <LinkedinShareButton url={shareURL}>
            <LinkedinIcon size={32} round={true} />
          </LinkedinShareButton>
        </Col>
      </Row>
    );
  };

  renderProjects = () => (
    <React.Fragment>
      <h5 className="mt-4">{this.props.label.titleProject}</h5>
      <Row>
        {this.state.projects.map((item, index) => {
          return (
            <Col key={index} lg={4} md={6} sm={12}>
              <Link className="card-link" to={`/project/${item._id}`}>
                <CustomCard
                  logo={item.logo || ProjectAvatar}
                  title={item.name}
                  description={item.short_description}
                  status="In Progress"
                />
              </Link>
              {item.participant === this.props.user._id && (
                <div className="edit-chal">
                  <Tag color="purple" onClick={() => this.handleUpdate(item)}>
                    Edit {this.props.label.titleProject}
                  </Tag>
                </div>
              )}
            </Col>
          );
        })}
        {this.props.user._id && this.props.loginMode === 0 && (
          <Col lg={4} md={6} sm={12}>
            <div
              className="custom-card mt-4"
              style={{
                backgroundImage: "linear-gradient(#404668, #151d4d, #1a245d)",
                color: "white",
              }}
            >
              <p style={{ fontSize: "14px", marginTop: 10 }}>JOIN IN</p>
              <div className="mb-4" />
              <p style={{ fontSize: "14px" }}>
                Interested in Creating New {this.props.label.titleProject}?
              </p>
              <div className="mb-4" />
              <button
                className="btn-custom-card mt-4"
                onClick={() => this.handleCreate()}
              >
                Create
              </button>
            </div>
          </Col>
        )}
      </Row>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    authOrg: state.organization.authOrg,
    loginMode: state.auth.loginMode,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
};

export default connect(mapStateToProps, {
  getChallenge,
  challengeProjects,
  createProject,
  updateProject,
  upvoteChallenge,
  listChallengeComment,
})(Challenge);
