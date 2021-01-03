import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Button, Row, Col } from "reactstrap";
import { Header } from "../../components/template";
import { Avatar, List, Card, Skeleton, Result } from "antd";
import {
  getProject,
  getParticipant,
  inviteProjectTeam,
  acceptInviteTeam,
  cancelInviteProjectTeam,
  upvoteProject,
} from "../../actions/project";
import { listComment } from "../../actions/comment";
import UserAvatar from "../../assets/img/user-avatar.png";
import ProjectInfo from "./project_info";
import Comments from "../../components/project/comment";

const { Meta } = Card;

class Project extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      curComment: {},
      chosenParticipantId: "",
    };
  }

  componentDidMount = async () => {
    const { getProject, getParticipant, listComment, match } = this.props;
    this._isMounted = true;
    this.setState({ loading: true });
    await getProject(match.params.id);
    await getParticipant(match.params.id);
    await listComment(match.params.id);
    if (!this._isMounted) return;
    this.setState({ loading: false });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  inviteParticipant = async (partId) => {
    const { project, inviteProjectTeam, getParticipant } = this.props;
    await inviteProjectTeam(project.project._id, partId);
    await getParticipant(project.project._id);
  };

  cancelInviteParticipant = async (partId) => {
    const { project, cancelInviteProjectTeam, getParticipant } = this.props;
    await cancelInviteProjectTeam(project.project._id, partId);
    await getParticipant(project.project._id);
  };

  acceptInviteTeam = async (pmId, accept) => {
    const { project, acceptInviteTeam, getParticipant } = this.props;
    await acceptInviteTeam(pmId, accept);
    await getParticipant(project.project._id);
  };

  upvoteProject = async (vote) => {
    const { upvoteProject, getProject, match } = this.props;
    await upvoteProject(match.params.id, vote);
    await getProject(match.params.id);
  };

  render = () => {
    const { loading } = this.state;
    const { project, user } = this.props;
    let isCreator =
      project.project.participant &&
      project.project.participant._id === user._id;

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="user-dashboard list-view">
            {!loading && (
              <ProjectInfo
                curProj={project.project}
                isCreator={isCreator}
                projectId={this.props.match.params.id}
                upvoteProject={this.upvoteProject}
              />
            )}
            {this.renderInvitation()}
            {!loading && <Comments projectId={this.props.match.params.id} />}
            {this.renderTeamMembers(isCreator)}
            {this.renderParticipants(isCreator)}
          </div>
        </Container>
      </React.Fragment>
    );
  };

  renderInvitation = () => {
    const { participants, project } = this.props.project;
    const { loading } = this.state;
    if (loading) return this.renderLoading(loading);

    for (let item of participants) {
      if (item.participant._id === this.props.user._id && item.pending) {
        return (
          <Result
            className="mt-4"
            status="success"
            title="You are Invited"
            subTitle={`Congratulation! You are invited to our project team - ${project.name}`}
            extra={[
              <Button
                color="primary"
                size="sm"
                key="accept"
                onClick={() => this.acceptInviteTeam(item._id, true)}
              >
                Accept
              </Button>,
              <Button
                outline
                color="danger"
                size="sm"
                key="buy"
                onClick={() => this.acceptInviteTeam(item._id, false)}
              >
                Decline
              </Button>,
            ]}
          />
        );
      }
    }
    return null;
  };

  renderTeamMembers = (isCreator) => {
    const { participants } = this.props.project;
    const listItem = participants.filter((item) => item.member === true);
    const { loading } = this.state;

    if (loading) return this.renderLoading(loading);
    return (
      <React.Fragment>
        <h5 className="mt-5">Project Team members</h5>
        <List
          itemLayout="horizontal"
          dataSource={listItem}
          renderItem={(item) => (
            <Card className="homepage-card name">
              <Meta
                title={
                  <Link
                    to={`/participant/${item.participant._id}`}
                  >{`${item.participant.profile.first_name} ${item.participant.profile.last_name}`}</Link>
                }
                avatar={
                  <Avatar src={item.participant.profile.photo || UserAvatar} />
                }
                description={
                  isCreator &&
                  `email: ${item.participant.email}${
                    item.participant.profile.phone
                      ? ", phone: " + item.participant.profile.phone
                      : ""
                  }`
                }
              />
            </Card>
          )}
        />
      </React.Fragment>
    );
  };

  renderParticipants = (isCreator) => {
    const { participants } = this.props.project;
    const listItem = participants.filter((item) => item.member !== true);
    const { loading } = this.state;

    if (loading) return this.renderLoading(loading);
    return (
      <React.Fragment>
        <h5 className="mt-5">Project Followed by</h5>
        <List
          itemLayout="horizontal"
          dataSource={listItem}
          renderItem={(item) => (
            <Card className="homepage-card name">
              <Meta
                title={
                  <Link to={`/participant/${item.participant._id}`}>
                    {`${item.participant.profile.first_name} ${item.participant.profile.last_name}`}
                  </Link>
                }
                avatar={
                  <Avatar src={item.participant.profile.photo || UserAvatar} />
                }
                description={
                  isCreator &&
                  `email: ${item.participant.email}${
                    item.participant.profile.phone
                      ? ", phone: " + item.participant.profile.phone
                      : ""
                  }`
                }
              />
              <div className="project-invite">
                {isCreator && item.pending && (
                  <div className="flex">
                    <Button color="link" size="sm" disabled>
                      Waiting...
                    </Button>
                    <Button
                      color="warning"
                      size="sm"
                      onClick={() =>
                        this.cancelInviteParticipant(item.participant._id)
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                {this.props.isAdmin && item.pending && (
                  <div className="flex">
                    {!isCreator && (
                      <Button color="link" size="sm" disabled>
                        Waiting...
                      </Button>
                    )}
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => this.acceptInviteTeam(item._id, true)}
                    >
                      accept
                    </Button>
                  </div>
                )}
                {isCreator && !item.pending && (
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.inviteParticipant(item.participant._id)}
                  >
                    Add Team
                  </Button>
                )}
              </div>
            </Card>
          )}
        />
      </React.Fragment>
    );
  };

  renderLoading = (loading) => (
    <Row>
      <Col>
        <Skeleton active loading={loading} />
      </Col>
    </Row>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    isAdmin: state.user.isAdmin,
    auth: state.auth,
    project: state.project,
    fieldData: state.profile.fieldData,
  };
};

export default connect(mapStateToProps, {
  getProject,
  getParticipant,
  inviteProjectTeam,
  acceptInviteTeam,
  cancelInviteProjectTeam,
  listComment,
  upvoteProject,
})(Project);
