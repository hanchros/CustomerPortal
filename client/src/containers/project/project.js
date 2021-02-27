import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { Header, Footer } from "../../components/template";
import { Skeleton, Avatar, Button, Tabs, Modal } from "antd";
import { PlusOutlined, MessageOutlined, LeftOutlined } from "@ant-design/icons";
import {
  getProject,
  getParticipant,
  listOrgByProject,
  updateProjectTechs,
} from "../../actions/project";
import ProjectEdit from "./project-edit";
import Timeline from "./project-timeline";
import history from "../../history";
import Invite from "./invite";
import { createTeamChat, setChannel } from "../../actions/message";
import PlatesImg from "../../assets/icon/plates.svg";
import ChallengeLogo from "../../assets/icon/challenge.png";
import UserIcon from "../../assets/img/user-avatar.png";
import TechImg from "../../assets/img/technology.png";
import NonList from "../../components/pages/non-list";
import Technology from "../template/technology";

const { TabPane } = Tabs;

class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showOrgs: false,
      showTeam: false,
      showEdit: false,
      showInvite: false,
      showDesc: false,
      visibleTech: false,
      technologies: [],
    };
  }

  componentDidMount = async () => {
    const { getProject, getParticipant, listOrgByProject, match } = this.props;
    this.setState({ loading: true });
    await getProject(match.params.id);
    await getParticipant(match.params.id);
    await listOrgByProject(match.params.id);
    this.setState({
      loading: false,
    });
  };

  onToggleInvite = () => {
    this.setState({ showInvite: !this.state.showInvite });
  };

  onToggleEdit = () => {
    this.setState({ showEdit: !this.state.showEdit });
  };

  onToggleDesc = () => {
    this.setState({ showDesc: !this.state.showDesc });
  };

  onToggleTechModal = () => {
    this.setState({ visibleTech: !this.state.visibleTech });
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

  setTechnologies = (technologies) => {
    this.setState({ technologies });
  };

  updateTechs = async () => {
    const { project, updateProjectTechs } = this.props;
    await updateProjectTechs(project.project._id, this.state.technologies);
    this.onToggleTechModal();
  };

  renderOrgMembers = () => {
    let users = this.props.project.participants;
    users.sort((a, b) => {
      return a.participant.profile.org_name > b.participant.profile.org_name;
    });
    return (
      <React.Fragment>
        <div className="flex mb-4" style={{ justifyContent: "flex-end" }}>
          <Button
            type="ghost"
            className="ghost-btn mr-3"
            onClick={this.goTeamChat}
          >
            <MessageOutlined style={{ fontSize: "16px" }} /> start team chat
          </Button>
          <Button
            onClick={this.onToggleInvite}
            type="ghost"
            className="black-btn"
          >
            <PlusOutlined /> Add user
          </Button>
        </div>
        <Row>
          {users.map((item) => (
            <Col
              key={item._id}
              md={4}
              onClick={() => this.onGotoUser(item.participant)}
            >
              <div className="user-card mb-3">
                <Avatar src={item.participant.profile.photo || UserIcon} />
                <div className="ml-3">
                  <span>
                    <b>{`${item.participant.profile.first_name} ${item.participant.profile.last_name}`}</b>
                  </span>
                  <br />
                  <span>{item.role || ""}</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </React.Fragment>
    );
  };

  renderProjInfo = (curProj, orgs) => {
    let leader = "";
    if (curProj.participant)
      leader = `${curProj.participant.profile.first_name} ${curProj.participant.profile.last_name}`;

    return (
      <div className="project-info-box">
        <div className="project-detail-head">
          <div className="pt-1">
            <img src={PlatesImg} alt="" />
          </div>
          <div style={{ width: "100%" }}>
            <div className="flex mb-5" style={{ alignItems: "center" }}>
              <h3>{curProj.name}</h3>
              <span className="ml-5">
                <i className="online-symbol">●</i>
                {curProj.status} project
              </span>
            </div>
            <p>{curProj.objective}</p>
            <Row style={{ maxWidth: "700px" }} className="mb-4">
              <Col md={6}>
                <div className="form-label mb-2 mt-2">
                  Organization involved
                </div>
                <span>
                  {orgs.map((item, index) => (
                    <React.Fragment key={index}>
                      {index !== 0 && <span>, </span>}
                      <Link to={`/${item.organization.org_name}`}>
                        {item.organization.org_name}
                      </Link>
                    </React.Fragment>
                  ))}
                </span>
              </Col>
              <Col md={6}>
                <div className="form-label mb-2 mt-2">Leader</div>
                <span>{leader}</span>
              </Col>
            </Row>
            <Link className="text-underline" to="#" onClick={this.onToggleDesc}>
              More details
            </Link>
            {this.state.showDesc && (
              <div className="mt-2" style={{ maxWidth: "700px" }}>
                {curProj.description}
              </div>
            )}
          </div>
        </div>
        <div className="project-img-box">
          <img src={curProj.logo || ChallengeLogo} alt="" />
        </div>
      </div>
    );
  };

  renderTechs = (curProj) => {
    const { visibleTech, technologies } = this.state;

    return (
      <React.Fragment>
        <div className="tech-btns">
          <Button
            type="ghost"
            className="ghost-btn mr-3"
            onClick={this.onToggleTechModal}
          >
            Add technology
          </Button>
        </div>
        {curProj.technologies && curProj.technologies.length === 0 && (
          <NonList
            title="You have no technologies yet"
            description="Use buttons above to add technologies."
          />
        )}
        {curProj.technologies && curProj.technologies.length > 0 && (
          <ul className="project-tech-items">
            {curProj.technologies.map((item) => (
              <li key={item._id} onClick={() => this.onGotoTech(item)}>
                <Avatar src={item.icon || TechImg} />
                <b>{item.title}</b>
              </li>
            ))}
          </ul>
        )}
        {visibleTech && (
          <Modal
            title="Project Technology"
            visible={visibleTech}
            width={800}
            footer={false}
            onCancel={this.onToggleTechModal}
          >
            <Technology
              technologies={technologies}
              onChangeTechs={this.setTechnologies}
            />
            <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
              <Button
                type="ghost"
                onClick={this.onToggleTechModal}
                className="ghost-btn"
              >
                Cancel
              </Button>
              <Button
                type="ghost"
                className="black-btn ml-3"
                onClick={this.updateTechs}
              >
                Submit
              </Button>
            </div>
          </Modal>
        )}
      </React.Fragment>
    );
  };

  render = () => {
    const { loading, showEdit, showInvite } = this.state;
    const { project, user, match, organization } = this.props;
    const curProj = project.project;
    const curOrg = organization.currentOrganization;
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
        <div className="account-nav">
          <Container>
            <Link to={`/${curOrg.org_name}/projects`}>
              <p>
                <LeftOutlined /> Back to Dashboard
              </p>
            </Link>
          </Container>
        </div>
        <Container className="sub-content">
          <Skeleton active loading={loading} />
          {this.renderProjInfo(curProj, project.organizations)}
          <Tabs
            defaultActiveKey="1"
            type="card"
            size="large"
            className="custom-tabs"
            onTabClick={() => this.setTechnologies(curProj.technologies || [])}
          >
            <TabPane tab="TIMELINE" key="1">
              <Timeline id={match.params.id} />
            </TabPane>
            <TabPane tab="TEAM" key="2">
              {this.renderOrgMembers()}
            </TabPane>
            <TabPane tab="TECHNOLOGIES" key="3">
              {this.renderTechs(curProj)}
            </TabPane>
          </Tabs>

          <hr className="mt-5" />
          {isCreator && (
            <Button
              onClick={this.onToggleEdit}
              type="ghost"
              className="black-btn mt-5 ml-auto"
            >
              Edit project
            </Button>
          )}
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
  updateProjectTechs,
})(Project);
