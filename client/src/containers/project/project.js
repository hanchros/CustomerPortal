import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { Header, Footer } from "../../components/template";
import { Skeleton, Button, Tabs } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import {
  getProject,
  getParticipant,
  listOrgByProject,
} from "../../actions/project";
import ProjectEdit from "./project-edit";
import Timeline from "./project-timeline";
import Invite from "./invite";
import PlatesImg from "../../assets/icon/plates.svg";
import ChallengeLogo from "../../assets/icon/challenge.png";
import ProjectTeam from "./project-team";
import ProjectInvite from "./project-invites";
import ProjectTech from "./project-tech";
import history from "../../history";

const { TabPane } = Tabs;

class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showEdit: false,
      showInvite: false,
      showDesc: false,
      showIvMng: false,
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

  onToggleIvMng = () => {
    this.setState({ showIvMng: !this.state.showIvMng });
  };

  goBack = () => {
    history.goBack();
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

  render = () => {
    const { loading, showEdit, showInvite, showIvMng } = this.state;
    const { project, user, match } = this.props;
    const curProj = project.project;
    let isCreator = curProj.participant && curProj.participant._id === user._id;

    if (showEdit) {
      return <ProjectEdit goback={this.onToggleEdit} curProject={curProj} />;
    }

    if (showInvite) {
      return <Invite goback={this.onToggleInvite} invite="team" />;
    }

    if (showIvMng) {
      return <ProjectInvite goback={this.onToggleIvMng} />;
    }

    return (
      <React.Fragment>
        <Header />
        <div className="account-nav">
          <Container>
            <Link to="#" onClick={this.goBack}>
              <p>
                <LeftOutlined /> Go back
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
          >
            <TabPane tab="TIMELINE" key="1">
              <Timeline id={match.params.id} isCreator={isCreator} />
            </TabPane>
            <TabPane tab="TEAM" key="2">
              <ProjectTeam
                onToggleInvite={this.onToggleInvite}
                onToggleIvMng={this.onToggleIvMng}
                isCreator={isCreator}
              />
            </TabPane>
            <TabPane tab="TECHNOLOGIES" key="3">
              <ProjectTech isCreator={isCreator} />
            </TabPane>
          </Tabs>
          <hr className="mt-4" />
          {isCreator && (
            <Button
              onClick={this.onToggleEdit}
              type="ghost"
              className="black-btn mt-4 ml-auto"
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
    organization: state.organization,
  };
};

export default connect(mapStateToProps, {
  getProject,
  getParticipant,
  listOrgByProject,
})(Project);
