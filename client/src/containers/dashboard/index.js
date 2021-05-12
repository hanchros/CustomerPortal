import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { Avatar, Skeleton, Tabs, Button } from "antd";
import { LinkedinFilled, PlusOutlined } from "@ant-design/icons";
import { Header, Footer } from "../../components/template";
import OrgLogo from "../../assets/icon/challenge.png";
import {
  getOrgByName,
  listOrgUsers,
  listOrgProjects,
} from "../../actions/organization";
import { protectedTest } from "../../actions/auth";
import history from "../../history";
import BuildLogo from "../../assets/icon/building.svg";
import InvitePage from "../organization/invite";
import NonList from "../../components/pages/non-list";
import SelectTemplate from "../project/select-template";
import OrgUsers from "../organization/users";
import { resolveNotification } from "../../actions/notification";
import { acceptOrgProject, resolveInvite } from "../../actions/invite";
import { ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";

const { TabPane } = Tabs;

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      show_detail: false,
      show_invite: false,
      show_project_create: false,
    };
  }

  componentDidMount = async () => {
    const { listOrgProjects, listOrgUsers, protectedTest } = this.props;
    this.setState({ loading: true });
    if (!this.props.curOrg._id) {
      await protectedTest();
    }
    if (this.props.curOrg._id) {
      await listOrgProjects(this.props.curOrg._id);
      await listOrgUsers(this.props.curOrg._id);
    }
    this.setState({ loading: false });
  };

  goToProject = (item) => {
    history.push(`/project/${item._id}`);
  };

  onToggleDetail = () => {
    this.setState({ show_detail: !this.state.show_detail });
  };

  onToggleInvite = () => {
    this.setState({ show_invite: !this.state.show_invite });
  };

  onToggleCreateProject = () => {
    this.setState({ show_project_create: !this.state.show_project_create });
  };

  renderProjects = () => {
    const { organization } = this.props;
    let projects = organization.projects;
    projects = projects.filter((proj) => !!proj.participant);

    return (
      <React.Fragment>
        <div className="flex mb-2" style={{ justifyContent: "flex-end" }}>
          <Button
            onClick={this.onToggleCreateProject}
            type="ghost"
            className="black-btn"
          >
            <PlusOutlined /> create project
          </Button>
        </div>
        <Row>
          <Col>
            <div className="projects-table-header">
              <span />
              <span>name</span>
              <span>organization</span>
              <span>leader</span>
              <span></span>
            </div>
            {projects.length === 0 && (
              <NonList
                title="You have no projects yet."
                description='Press "Create project" button to start.'
              />
            )}
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
                <div className="cell0">{proj.participant.profile.org_name}</div>
                <div className="cell0">
                  {proj.participant.profile.first_name}{" "}
                  {proj.participant.profile.last_name}
                </div>
                <div className="cell0"></div>
              </div>
            ))}
          </Col>
        </Row>
      </React.Fragment>
    );
  };

  renderOrgInfo = () => {
    const { show_detail, loading } = this.state;
    const { curOrg } = this.props;
    if (loading) return null;
    return (
      <div className="project-info-box">
        <div className="project-detail-head">
          <div className="pt-1">
            <img src={BuildLogo} alt="" />
          </div>
          <div style={{ width: "100%" }}>
            <div className="flex mb-5" style={{ alignItems: "center" }}>
              <h3>{curOrg.org_name}</h3>
            </div>
            <p>{curOrg.bio || ""}</p>
            {show_detail && (
              <Row style={{ maxWidth: "700px" }} className="mb-4">
                <Col md={6}>
                  <div className="form-label mb-1 mt-4">Type</div>
                  <span>{curOrg.org_type}</span>
                  <div className="form-label mb-1 mt-4">Admin</div>
                  <Link to={`/user/${curOrg.creator._id}`}>
                    {curOrg.creator.profile.first_name}{" "}
                    {curOrg.creator.profile.last_name}
                  </Link>
                  {(curOrg.linkedin || curOrg.social) && (
                    <div className="org-link-box">
                      {curOrg.linkedin && (
                        <a
                          href={curOrg.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkedinFilled />
                        </a>
                      )}
                      {curOrg.social && (
                        <a
                          href={curOrg.social}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pl-4 pr-4"
                        >
                          {curOrg.social}
                        </a>
                      )}
                    </div>
                  )}
                </Col>
                <Col md={6}>
                  <div className="form-label mb-1 mt-4">Headquarters</div>
                  <span>{curOrg.location || ""}</span>
                </Col>
              </Row>
            )}
            <Link
              className="text-underline"
              to="#"
              onClick={this.onToggleDetail}
            >
              {show_detail ? "Less" : "More"} details
            </Link>
          </div>
        </div>
        <div className="project-img-box">
          <img src={curOrg.logo || OrgLogo} alt="" />
        </div>
      </div>
    );
  };

  onAcceptInvite = async (item) => {
    const { resolveNotification, acceptOrgProject, resolveInvite } = this.props;
    await acceptOrgProject(item.invite);
    await resolveInvite(item.invite, true);
    await resolveNotification(item._id, "accepted");
  };

  onDeclineInvite = async (item) => {
    const { resolveNotification, resolveInvite } = this.props;
    await resolveInvite(item.invite, false);
    await resolveNotification(item._id, "declined");
  };

  renderProjectInvite = () => {
    const notifications = this.props.notification.notifications;
    let invites = [];
    for (let notif of notifications) {
      if (notif.status === "pending") {
        invites.push(notif);
      }
    }
    if (invites.length === 0) return null;
    return (
      <React.Fragment>
        {invites.map((item) => (
          <div key={item._id} className="notif-box">
            <div className="main-body">
              <div
                className="flex mb-3"
                style={{ justifyContent: "space-between" }}
              >
                <h5>
                  <b>{item.title}</b>
                </h5>
                <span className="date-format">
                  <ClockCircleOutlined className="mr-2" />
                  {moment(item.createdAt).format("MMM DD, h:mmA")}
                </span>
              </div>
              <div
                style={{ fontSize: "14px" }}
                className="notif-content"
                dangerouslySetInnerHTML={{ __html: item.body }}
              />
            </div>
            <div className="action-body">
              <span className="error">Your action is required</span>
              <div className="flex">
                <Button
                  type="ghost"
                  className="ghost-btn mr-3"
                  onClick={() => this.onDeclineInvite(item)}
                >
                  decline
                </Button>
                <Button
                  type="ghost"
                  className="black-btn"
                  onClick={() => this.onAcceptInvite(item)}
                >
                  accept invitation
                </Button>
              </div>
            </div>
          </div>
        ))}
      </React.Fragment>
    );
  };

  render() {
    const { loading, show_invite, show_project_create } = this.state;
    const { users, curOrg } = this.props;

    if (show_invite)
      return (
        <React.Fragment>
          <Header />
          <Container className="content">
            <InvitePage goBack={this.onToggleInvite} />
          </Container>
        </React.Fragment>
      );

    if (show_project_create)
      return <SelectTemplate goBack={this.onToggleCreateProject} />;

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          {curOrg._id && this.renderOrgInfo()}
          {this.renderProjectInvite()}
          {!loading && curOrg._id && (
            <Tabs
              defaultActiveKey="1"
              type="card"
              size="large"
              className="custom-tabs"
            >
              <TabPane tab="PROJECTS" key="1">
                {this.renderProjects()}
              </TabPane>
              <TabPane tab="USERS" key="2">
                <OrgUsers users={users} onToggleInvite={this.onToggleInvite} />
              </TabPane>
            </Tabs>
          )}
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    orgSettings: state.organization.orgSettings,
    project: state.project,
    curOrg: state.organization.currentOrganization,
    users: state.organization.users,
    organization: state.organization,
    notification: state.notification,
  };
}

export default connect(mapStateToProps, {
  getOrgByName,
  listOrgProjects,
  listOrgUsers,
  protectedTest,
  resolveInvite,
  acceptOrgProject,
  resolveNotification,
})(Dashboard);
