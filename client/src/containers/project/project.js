import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { Skeleton, Row, Col, List, Avatar } from "antd";
import {
  getProject,
  getParticipant,
  listOrgByProject,
} from "../../actions/project";
import ChallengeLogo from "../../assets/icon/challenge.png";
import UserIcon from "../../assets/img/user-avatar.png";
import ProjectOrgs from "./project-org";
import ProjectTeam from "./project-team";
import ProjectTech from "./project-tech";
import ProjectEdit from "./project-edit";

class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showOrgs: false,
      showTeam: false,
      showTech: false,
      showEdit: false,
    };
  }

  onToggleShowOrgs = () => {
    this.setState({ showOrgs: !this.state.showOrgs });
  };

  onToggleShowTeam = () => {
    this.setState({ showTeam: !this.state.showTeam });
  };

  onToggleShowTech = () => {
    this.setState({ showTech: !this.state.showTech });
  };

  onToggleEdit = () => {
    this.setState({ showEdit: !this.state.showEdit });
  };

  componentDidMount = async () => {
    const { getProject, getParticipant, listOrgByProject, match } = this.props;
    this.setState({ loading: true });
    await getProject(match.params.id);
    await getParticipant(match.params.id);
    await listOrgByProject(match.params.id);
    this.setState({ loading: false });
  };

  render = () => {
    const { loading, showOrgs, showTeam, showTech, showEdit } = this.state;
    const { project, user } = this.props;
    const curProj = project.project;
    const participants = project.participants;
    const organizations = project.organizations;
    let isCreator = curProj.participant && curProj.participant._id === user._id;

    if (showOrgs) {
      return <ProjectOrgs goback={this.onToggleShowOrgs} />;
    }
    if (showTeam) {
      return <ProjectTeam goback={this.onToggleShowTeam} />;
    }
    if (showTech) {
      return <ProjectTech goback={this.onToggleShowTech} />;
    }
    if (showEdit) {
      return <ProjectEdit goback={this.onToggleEdit} curProject={curProj} />;
    }

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Skeleton active loading={loading} />
          <Row gutter={50}>
            <Col md={16} sm={24}>
              <div className="project-detail-head">
                <div>
                  <img src={curProj.logo || ChallengeLogo} alt="" />
                </div>
                <div className="project-detail-headerbox">
                  <h3>{curProj.name}</h3>
                  {curProj.participant && (
                    <span>
                      leader: {curProj.participant.profile.first_name}{" "}
                      {curProj.participant.profile.last_name} -{" "}
                      {curProj.participant.profile.org_name}
                    </span>
                  )}
                  <br />
                  <b>status: {curProj.status}</b>
                </div>
              </div>
              <div className="project-detail-desc">{curProj.description}</div>
              <div className="project-detail-desc">
                <h5>Project Timeline:</h5>
                <ul>
                  <li>More recent here</li>
                  <li>Older here</li>
                  <li>Even older here</li>
                </ul>
              </div>
              {isCreator && (
                <div className="mt-5 mb-4 flex">
                  <button
                    className="main-btn template-btn mr-4"
                    onClick={this.onToggleEdit}
                  >
                    Edit
                  </button>
                </div>
              )}
            </Col>
            <Col md={8} sm={24}>
              <div
                className="project-detail-clients"
                onClick={this.onToggleShowOrgs}
              >
                <h5>Client & Partner Organization:</h5>
                <List
                  itemLayout="horizontal"
                  className="project-list mt-1"
                  dataSource={organizations}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={item.organization.logo || ChallengeLogo}
                          />
                        }
                        title={<b>{item.organization.org_name}</b>}
                        description={
                          <span>
                            {item.organization.org_type || ""}{" "}
                            {item.organization.location || ""}
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
              <div
                className="project-detail-clients"
                onClick={this.onToggleShowTeam}
              >
                <h5>Team:</h5>
                <List
                  itemLayout="horizontal"
                  className="project-list mt-1"
                  dataSource={participants}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={item.participant.profile.photo || UserIcon}
                          />
                        }
                        title={
                          <b>
                            {item.participant.profile.first_name}{" "}
                            {item.participant.profile.last_name}
                          </b>
                        }
                        description={
                          <span>{item.participant.profile.org_name || ""}</span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
              <div
                className="project-detail-clients"
                onClick={this.onToggleShowTech}
              >
                <h5>Technology:</h5>
                <ul>
                  {curProj.technologies &&
                    curProj.technologies.map((tech) => (
                      <li key={tech.title}>{tech.title}</li>
                    ))}
                </ul>
              </div>
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
    isAdmin: state.user.isAdmin,
    auth: state.auth,
    project: state.project,
    fieldData: state.profile.fieldData,
  };
};

export default connect(mapStateToProps, {
  getProject,
  getParticipant,
  listOrgByProject,
})(Project);
