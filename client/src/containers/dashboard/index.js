import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Avatar, Skeleton, Tabs } from "antd";
import { Header, Footer } from "../../components/template";
import OrgLogo from "../../assets/icon/challenge.png";
import UserAvatar from "../../assets/img/user-avatar.png";
import { getOrgByName, listOrgUsers } from "../../actions/organization";
import { listProjectDetails } from "../../actions/project";
import history from "../../history";

const { TabPane } = Tabs;

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
    };
  }

  componentDidMount = async () => {
    const {
      match,
      getOrgByName,
      listProjectDetails,
      listOrgUsers,
    } = this.props;
    let org_name = match.params.org_name;
    if (org_name) {
      this.setState({ loading: true });
      let org = await getOrgByName(org_name);
      await listProjectDetails(org._id);
      await listOrgUsers(org._id);
      this.setState({ loading: false });
    }
  };

  goToProject = (item) => {
    history.push(`/${this.props.match.params.org_name}/project/${item._id}`);
  };

  goToUser = (id) => {
    history.push(`/user/${id}`);
  };

  renderProjects = () => {
    const { project } = this.props;
    let projects = project.projectDetails;
    projects = projects.filter((proj) => proj.status !== "Archived");

    return (
      <Row className="mt-4">
        <Col>
          <div className="projects-table-header">
            <span />
            <span>name</span>
            <span>organization</span>
            <span>leader</span>
            <span>status</span>
          </div>
          {projects.map((proj) => (
            <div
              className="project-table-item constracted"
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
              <div className="cell0">
                <i className="online-symbol" style={{ fontSize: "14px" }}>
                  ●
                </i>
                {proj.status}
              </div>
            </div>
          ))}
        </Col>
      </Row>
    );
  };

  renderUsers = () => {
    const { organization } = this.props;
    const users = organization.users;

    return (
      <Row className="mt-4">
        {users.map((item) => (
          <Col key={item._id} md={4} onClick={() => this.goToUser(item._id)}>
            <div className="user-card">
              <Avatar src={item.profile.photo || UserAvatar} />
              <div className="ml-3">
                <span>
                  <b>{`${item.profile.first_name} ${item.profile.last_name}`}</b>
                </span>
                <br />
                <span>{item.profile.role || ""}</span>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  render() {
    const { orgSettings } = this.props;
    const { loading } = this.state;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Row className="mb-5">
            <Col md={8} className="mb-4">
              <div className="detail-desc">
                <h3>{orgSettings.title_page || orgSettings.org_name}</h3>
                <p>{orgSettings.title_page_description}</p>
              </div>
            </Col>
            <Col md={4}>
              <img
                src={orgSettings.logo || OrgLogo}
                alt="logo"
                className="org-dashboard-logo"
              />
            </Col>
          </Row>
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          {!loading && (
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
                {this.renderUsers()}
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
    organization: state.organization,
  };
}

export default connect(mapStateToProps, {
  getOrgByName,
  listProjectDetails,
  listOrgUsers,
})(Dashboard);
