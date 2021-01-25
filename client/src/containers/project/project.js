import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { Skeleton, Row, Col } from "antd";
import {
  getProject,
  getParticipant,
  listOrgByProject,
} from "../../actions/project";
import ChallengeLogo from "../../assets/icon/challenge.png";
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
    const { project, user, orgSettings } = this.props;
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
                <div
                  className="project-detail-headerbox"
                  style={{
                    borderColor: orgSettings.primary_color,
                  }}
                >
                  <h3>{curProj.name}</h3>
                  <span>Project Leader</span>
                  <br />
                  <b>{curProj.status}</b>
                </div>
              </div>
              <div
                className="project-detail-desc"
                style={{
                  borderColor: orgSettings.primary_color,
                }}
              >
                {curProj.description}
              </div>
              <div
                className="project-detail-desc"
                style={{
                  borderColor: orgSettings.primary_color,
                }}
              >
                <h5>Project Timeline:</h5>
                <ul>
                  <li>More recent here</li>
                  <li>Older here</li>
                  <li>Even older here</li>
                </ul>
              </div>
            </Col>
            <Col md={8} sm={24}>
              <div
                className="project-detail-clients"
                onClick={this.onToggleShowOrgs}
                style={{
                  borderColor: orgSettings.primary_color,
                }}
              >
                <h5>Client & Partner Organization:</h5>
                <ul>
                  {organizations.map((org) => (
                    <li key={org._id}>{org.organization.org_name}</li>
                  ))}
                </ul>
              </div>
              <div
                className="project-detail-clients"
                onClick={this.onToggleShowTeam}
                style={{
                  borderColor: orgSettings.primary_color,
                }}
              >
                <h5>Team:</h5>
                <ul>
                  {participants.map((pt) => (
                    <li key={pt._id}>
                      {pt.participant.profile.first_name}{" "}
                      {pt.participant.profile.last_name}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="project-detail-clients"
                onClick={this.onToggleShowTech}
                style={{
                  borderColor: orgSettings.primary_color,
                }}
              >
                <h5>Technology:</h5>
                <ul>
                  {curProj.technologies &&
                    curProj.technologies.map((tech) => (
                      <li key={tech.application}>{tech.application}</li>
                    ))}
                </ul>
              </div>
            </Col>
          </Row>
          {isCreator && (
            <button
              className="main-btn template-btn mt-5"
              onClick={this.onToggleEdit}
            >
              Edit
            </button>
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
    isAdmin: state.user.isAdmin,
    auth: state.auth,
    project: state.project,
    fieldData: state.profile.fieldData,
    orgSettings: state.organization.orgSettings,
  };
};

export default connect(mapStateToProps, {
  getProject,
  getParticipant,
  listOrgByProject,
})(Project);
