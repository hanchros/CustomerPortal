import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { Avatar, Skeleton, Tabs } from "antd";
import { LinkedinFilled, LeftOutlined } from "@ant-design/icons";
import { Header, Footer } from "../../components/template";
import OrgLogo from "../../assets/icon/challenge.png";
import {
  getOrgByName,
  listOrgUsers,
  listOrgProjects,
} from "../../actions/organization";
import history from "../../history";
import BuildLogo from "../../assets/icon/building.svg";
import { org_consts } from "../../constants";
import NonList from "../../components/pages/non-list";
import OrgUsers from "./users";

const { TabPane } = Tabs;

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      org: null,
      show_detail: false,
    };
  }

  componentDidMount = async () => {
    const { match, getOrgByName, listOrgProjects, listOrgUsers } = this.props;
    let org_name = match.params.org_name;
    if (org_name) {
      this.setState({ loading: true });
      let org = await getOrgByName(org_name);
      if (org) {
        await listOrgProjects(org._id);
        await listOrgUsers(org._id);
        this.setAppColors(org.profile);
      }
      this.setState({ loading: false, org });
    }
  };

  setAppColors = (settings) => {
    let values = settings;
    if (!settings || !settings.primary_color) values = org_consts;
    const astyle = document.documentElement.style;
    astyle.setProperty("--primary_color", values.primary_color);
  };

  componentWillUnmount = () => {
    this.setAppColors(this.props.orgSettings);
  };

  goToProject = (item) => {
    history.push(`/project/${item._id}`);
  };

  onToggleDetail = () => {
    this.setState({ show_detail: !this.state.show_detail });
  };

  goback = () => {
    history.goBack();
  };

  renderProjects = () => {
    const { organization } = this.props;
    let projects = organization.projects;
    projects = projects.filter((proj) => !!proj.participant);

    return (
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
            <NonList title="No projects yet." description="" />
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
    );
  };

  renderOrgInfo = () => {
    const { org, show_detail, loading } = this.state;
    if (loading) return null;
    if (!org)
      return (
        <div className="project-info-box">
          <h3>Organization doesn't exist</h3>
        </div>
      );
    return (
      <div className="project-info-box">
        <div className="project-detail-head">
          <div className="pt-1">
            <img src={BuildLogo} alt="" />
          </div>
          <div style={{ width: "100%" }}>
            <div className="flex mb-5" style={{ alignItems: "center" }}>
              <h3>{org.org_name}</h3>
            </div>
            <p>{org.bio || ""}</p>
            {show_detail && (
              <Row style={{ maxWidth: "700px" }} className="mb-4">
                <Col md={6}>
                  <div className="form-label mb-1 mt-4">Type</div>
                  <span>{org.org_type}</span>
                  <div className="form-label mb-1 mt-4">Admin</div>
                  <Link to={`/user/${org.creator._id}`}>
                    {org.creator.profile.first_name}{" "}
                    {org.creator.profile.last_name}
                  </Link>
                  {(org.linkedin || org.social) && (
                    <div className="org-link-box">
                      {org.linkedin && (
                        <a
                          href={org.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkedinFilled />
                        </a>
                      )}
                      {org.social && (
                        <a
                          href={org.social}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pl-4 pr-4"
                        >
                          {org.social}
                        </a>
                      )}
                    </div>
                  )}
                </Col>
                <Col md={6}>
                  <div className="form-label mb-1 mt-4">Headquarters</div>
                  <span>{org.location || ""}</span>
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
          <img src={org.logo || OrgLogo} alt="" />
        </div>
      </div>
    );
  };

  render() {
    const { loading } = this.state;
    const users = this.props.organization.users;

    return (
      <React.Fragment>
        <Header />
        <div className="account-nav">
          <Container>
            <Link to="#" onClick={this.goback}>
              <p>
                <LeftOutlined /> Go back
              </p>
            </Link>
          </Container>
        </div>
        <Container className="sub-content">
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          {this.renderOrgInfo()}
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
                <OrgUsers users={users} />
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
  listOrgProjects,
  listOrgUsers,
})(Dashboard);
