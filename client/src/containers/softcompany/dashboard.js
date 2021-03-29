import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { Avatar, Skeleton, Tabs, List } from "antd";
import { Header, Footer } from "../../components/template";
import OrgLogo from "../../assets/icon/challenge.png";
import { listOrgProjects } from "../../actions/organization";
import { protectedTest } from "../../actions/auth";
import history from "../../history";
import BuildLogo from "../../assets/icon/display.svg";
import NonList from "../../components/pages/non-list";

const { TabPane } = Tabs;

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      show_detail: false,
      show_invite: false,
      title: "",
    };
  }

  componentDidMount = async () => {
    const { user, protectedTest } = this.props;

    this.setState({ loading: true });
    if (!user._id) {
      await protectedTest();
    }
    // await listOrgProjects(curOrg._id);
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

  renderTitleItem = (title) => (
    <List.Item
      onClick={() => this.setState({ title })}
      className={this.state.title === title && "active"}
    >
      <span >{title}</span>
    </List.Item>
  );

  renderServices = () => {
    const { user } = this.props;
    const { title } = this.state;
    const services = user.profile.services;
    let titles = [],
      items = [];
    for (let sv of services) {
      if (sv.items.length > 0) titles.push(sv.title);
      if (sv.title === title) items = sv.items;
    }
    return (
      <Row>
        <Col md={4}>
          <List
            size="large"
            dataSource={titles}
            className="techhub-title-list"
            renderItem={this.renderTitleItem}
          />
        </Col>
        <Col md={8}>
          <div className="account-form-box mb-3" style={{minHeight: "40vh"}}>
            {items.map((item) => (
              <h5 key={item} className="mb-4">
                <b>{item}</b>
              </h5>
            ))}
          </div>
        </Col>
      </Row>
    );
  };

  renderProjects = () => {
    let projects = this.props.projects;
    projects = projects.filter((proj) => !!proj.participant);
    return (
      <React.Fragment>
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

  renderCompanyInfo = () => {
    const { show_detail, loading } = this.state;
    const { user } = this.props;
    const profile = user.profile;
    if (loading || !profile) return null;

    return (
      <div className="project-info-box">
        <div className="project-detail-head">
          <div className="pt-1">
            <img src={BuildLogo} alt="" />
          </div>
          <div style={{ width: "100%" }}>
            <div className="flex mb-5" style={{ alignItems: "center" }}>
              <h3>{profile.org_name}</h3>
            </div>
            <p>{profile.description || ""}</p>
            {show_detail && (
              <Row style={{ maxWidth: "700px" }} className="mb-4">
                <Col md={6}>
                  <div className="form-label mb-1 mt-4">Type</div>
                  <span>{profile.org_type}</span>
                  <div className="form-label mb-1 mt-4">Phone</div>
                  <span>{profile.phone}</span>
                  <div className="form-label mb-1 mt-4">Service</div>
                  <span>{profile.main_service}</span>
                  <div className="form-label mb-1 mt-4">Website</div>
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.website}
                    </a>
                  )}
                </Col>
                <Col md={6}>
                  <div className="form-label mb-1 mt-4">Contact</div>
                  <span>{profile.contact || ""}</span>
                  <div className="form-label mb-1 mt-4">Address</div>
                  <span>{profile.address || ""}</span>
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
          <img src={profile.logo || OrgLogo} alt="" />
        </div>
      </div>
    );
  };

  render() {
    const { user } = this.props;
    const { loading } = this.state;
    // if (show_invite)
    //   return (
    //     <React.Fragment>
    //       <Header />
    //       <Container className="content">
    //         <InvitePage goBack={this.onToggleInvite} />
    //       </Container>
    //     </React.Fragment>
    //   );

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          {this.renderCompanyInfo()}
          {!loading && user.profile && (
            <Tabs
              defaultActiveKey="1"
              type="card"
              size="large"
              className="custom-tabs"
            >
              <TabPane tab="SERVICES" key="1">
                {this.renderServices()}
              </TabPane>
              <TabPane tab="PROJECTS" key="2">
                {this.renderProjects()}
              </TabPane>
              <TabPane tab="INVITATIONS" key="3">
                <h3>Show Invitations</h3>
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
    user: state.user.profile,
    projects: state.user.projects,
  };
}

export default connect(mapStateToProps, {
  listOrgProjects,
  protectedTest,
})(Dashboard);
