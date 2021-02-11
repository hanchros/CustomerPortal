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
import Timeline from "./project-timeline";
import TechImg from "../../assets/img/technology.png";

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

  onToggleShowTeam = (e) => {
    e.stopPropagation();
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

  getTeamMembers = (org_name) => {
    const { project } = this.props;
    if (project.participants.length === 0) return [];
    return project.participants.filter(
      (pm) => pm.participant.profile.org_name === org_name
    );
  };

  render = () => {
    const { loading, showOrgs, showTeam, showTech, showEdit } = this.state;
    const { project, user, match } = this.props;
    const curProj = project.project;
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
              <div className="project-info-box">
                <div className="project-detail-head">
                  <div className="project-img-box">
                    <img src={curProj.logo || ChallengeLogo} alt="" />
                  </div>
                  <div>
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
                <span>Short Description:</span>
                <p>{curProj.objective}</p>
                <span>Long Description:</span>
                <p>{curProj.description} </p>
              </div>
              <Timeline id={match.params.id} />
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
                <h5>&nbsp; Project Team:</h5>
                {organizations.map((org) => (
                  <div key={org._id} className="project-team-box">
                    <div className="project-org-box">
                      <Avatar src={org.organization.logo || ChallengeLogo} />
                      <div className="ml-3">
                        <b>{org.organization.org_name}</b>
                        <br />
                        <span style={{ fontSize: "14px" }}>
                          {org.organization.org_type || ""}{" "}
                          {org.organization.location || ""}
                        </span>
                      </div>
                    </div>
                    {this.getTeamMembers(org.organization.org_name).length >
                      0 && (
                      <List
                        itemLayout="horizontal"
                        className="project-list pl-2"
                        dataSource={this.getTeamMembers(
                          org.organization.org_name
                        )}
                        renderItem={(item) => (
                          <List.Item onClick={this.onToggleShowTeam}>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  src={
                                    item.participant.profile.photo || UserIcon
                                  }
                                />
                              }
                              title={
                                <b>
                                  {item.participant.profile.first_name}{" "}
                                  {item.participant.profile.last_name}
                                </b>
                              }
                              description={
                                <span>
                                  {item.participant.profile.role || ""}
                                </span>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div
                className="project-detail-clients"
                onClick={this.onToggleShowTech}
                style={{ cursor: "pointer" }}
              >
                <h5>&nbsp; Technology:</h5>
                <List
                  itemLayout="horizontal"
                  className="project-list pl-2"
                  dataSource={curProj.technologies}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={item.icon || TechImg} />}
                        title={<b>{item.title}</b>}
                      />
                    </List.Item>
                  )}
                />
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
