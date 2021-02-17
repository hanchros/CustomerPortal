import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { Skeleton, Row, Col, List, Avatar, Collapse, Button } from "antd";
import {
  PlusOutlined,
  InfoCircleFilled,
  MessageOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  getProject,
  getParticipant,
  listOrgByProject,
} from "../../actions/project";
import ChallengeLogo from "../../assets/icon/challenge.png";
import UserIcon from "../../assets/img/user-avatar.png";
import ProjectEdit from "./project-edit";
import Timeline from "./project-timeline";
import TechImg from "../../assets/img/technology.png";
import history from "../../history";
import Invite from "./invite";
import { createTeamChat, setChannel } from "../../actions/message";

const { Panel } = Collapse;

class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showOrgs: false,
      showTeam: false,
      showEdit: false,
      showInvite: false,
    };
  }

  componentDidMount = async () => {
    const { getProject, getParticipant, listOrgByProject, match } = this.props;
    this.setState({ loading: true });
    await getProject(match.params.id);
    await getParticipant(match.params.id);
    await listOrgByProject(match.params.id);
    this.setState({ loading: false });
  };

  onToggleInvite = () => {
    this.setState({ showInvite: !this.state.showInvite });
  };

  onToggleEdit = () => {
    this.setState({ showEdit: !this.state.showEdit });
  };

  goTeamChat = async () => {
    const { project, message, createTeamChat, setChannel } = this.props;
    const curProj = project.project;
    let conversations = message.conversations;
    for (let cv of conversations) {
      if (cv.project && cv.project === curProj._id) {
        setChannel(cv._id);
        history.push("/messages");
        return;
      }
    }
    const cvId = await createTeamChat(curProj.name, curProj._id);
    setChannel(cvId);
    history.push("/messages");
  };

  onGotoTech = (item) => {
    const curOrg = this.props.organization.currentOrganization;
    let tab = 3;
    if (item.organization) {
      tab = 4;
    }
    history.push(`/${curOrg.org_name}/techhub?tab=${tab}&id=${item._id}`);
  };

  onGotoUser = (user) => {
    const { project } = this.props;
    const curProj = project.project;
    history.push(`/user/${user._id}?project=${curProj._id}`);
  };

  getTeamMemberGroup = () => {
    const { project } = this.props;
    if (project.participants.length === 0) return [];
    let result = [];
    for (let pt of project.participants) {
      let flts = result.filter(
        (item) => item.org === pt.participant.profile.org_name
      );
      if (flts.length === 0) {
        result.push({
          org: pt.participant.profile.org_name,
          participants: [pt.participant],
        });
      } else {
        flts[0].participants.push(pt.participant);
      }
    }
    return result;
  };

  renderOrgMembers = () => {
    const groups = this.getTeamMemberGroup();
    if (groups.length === 0) return null;
    return groups.map((group) => (
      <div key={group.org} className="project-team-box">
        <span className="project-span">
          {group.org || "Unknown organization"}{" "}
          <InfoCircleFilled style={{ fontSize: "12px", color: "gray" }} />
        </span>
        <List
          itemLayout="horizontal"
          dataSource={group.participants}
          renderItem={(item) => (
            <List.Item onClick={() => this.onGotoUser(item)}>
              <List.Item.Meta
                avatar={<Avatar src={item.profile.photo || UserIcon} />}
                title={
                  <b>
                    {item.profile.first_name} {item.profile.last_name}
                  </b>
                }
                description={<span>{item.profile.role || ""}</span>}
              />
            </List.Item>
          )}
        />
      </div>
    ));
  };

  render = () => {
    const { loading, showEdit, showInvite } = this.state;
    const { project, user, match } = this.props;
    const curProj = project.project;
    let isCreator = curProj.participant && curProj.participant._id === user._id;

    if (showEdit) {
      return <ProjectEdit goback={this.onToggleEdit} curProject={curProj} />;
    }

    if (showInvite) {
      return <Invite goback={this.onToggleInvite} invite="team" />;
    }

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Skeleton active loading={loading} />
          <Row gutter={50}>
            <Col md={16} sm={24}>
              <div className="project-info">
                <div className="project-info-box">
                  <div className="project-detail-head">
                    <h3>{curProj.name}</h3>
                    {curProj.participant && (
                      <span>
                        leader: {curProj.participant.profile.first_name}{" "}
                        {curProj.participant.profile.last_name},{" "}
                        {curProj.participant.profile.org_name}
                        <span className="ml-5">
                          <i className="online-symbol">●</i>
                          {curProj.status}
                        </span>
                      </span>
                    )}
                    <p className="mt-4">{curProj.objective}</p>
                  </div>
                  <div className="project-img-box">
                    <img src={curProj.logo || ChallengeLogo} alt="" />
                  </div>
                </div>
                <Collapse accordion className="project-desc-collapse">
                  <Panel header={"show full description"}>
                    <p>{curProj.description} </p>
                  </Panel>
                </Collapse>
                <Timeline id={match.params.id} />
              </div>
            </Col>
            <Col md={8} sm={24}>
              <div className="project-team-header">
                <h5>
                  <b>Team</b>
                </h5>
                <Button
                  onClick={this.onToggleInvite}
                  type="ghost"
                  className="ghost-btn"
                >
                  <PlusOutlined /> INVITE NEW MEMBER
                </Button>
              </div>
              {this.renderOrgMembers()}
              {isCreator && (
                <Button
                  type="ghost"
                  style={{ width: "100%" }}
                  className="mt-4 mb-5 black-btn"
                  onClick={this.goTeamChat}
                >
                  <MessageOutlined style={{ fontSize: "16px" }} /> start team
                  chat
                </Button>
              )}
              <div className="project-team-header mt-4 mb-4">
                <h5>
                  <b>Technologies</b>
                </h5>
                <Button onClick={() => {}} type="ghost" className="ghost-btn">
                  <PlusOutlined /> Add New
                </Button>
              </div>
              <ul className="project-tech-items">
                {curProj.technologies &&
                  curProj.technologies.map((item) => (
                    <li key={item._id} onClick={() => this.onGotoTech(item)}>
                      <Avatar src={item.icon || TechImg} />
                      <b>{item.title}</b>
                    </li>
                  ))}
              </ul>
              {isCreator && (
                <Button
                  onClick={this.onToggleEdit}
                  type="ghost"
                  className="black-btn mt-4 mb-4"
                  style={{ float: "right" }}
                >
                  <EditOutlined /> Edit
                </Button>
              )}
            </Col>
          </Row>
        </Container>
        <Footer />
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    project: state.project,
    message: state.message,
    organization: state.organization,
  };
};

export default connect(mapStateToProps, {
  getProject,
  getParticipant,
  listOrgByProject,
  createTeamChat,
  setChannel,
})(Project);
