import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { List, Avatar, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { Header, Footer } from "../../components/template";
import OrgLogo from "../../assets/icon/challenge.png";
import UserAvatar from "../../assets/img/user-avatar.png";
import { getOrgByName, listOrgUsers } from "../../actions/organization";
import { listProjectDetails } from "../../actions/project";
import history from "../../history";

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

  render() {
    const { orgSettings, organization, project } = this.props;
    const { loading } = this.state;
    const users = organization.users;
    let projects = project.projectDetails;
    projects = projects.filter((proj) => proj.status !== "Archived");
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Row>
            <Col xl={4} md={5} className="mb-4">
              <img
                src={orgSettings.logo || OrgLogo}
                alt="logo"
                className="org-dashboard-logo"
              />
            </Col>
            <Col xl={8} md={7}>
              <div className="detail-desc">
                <div className="project-header">
                  <h3>{orgSettings.title_page || orgSettings.org_name}</h3>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="org-desc-box mt-4">
                {orgSettings.title_page_description}
              </div>
            </Col>
          </Row>
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          <Row>
            <Col md={6} sm={12}>
              <h5 className="mt-5">Projects</h5>
              <List
                itemLayout="horizontal"
                className="project-list mt-4"
                dataSource={projects}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => this.goToProject(item)}
                    actions={[<Link to="#">{item.status}</Link>]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.logo || OrgLogo} />}
                      title={<b>{item.name}</b>}
                      description={
                        <span>
                          {item.participant && (
                            <span>
                              {item.participant.profile.first_name}{" "}
                              {item.participant.profile.last_name} -{" "}
                              {item.participant.profile.org_name}
                            </span>
                          )}
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            </Col>
            <Col md={6} sm={12}>
              <h5 className="mt-5">Users</h5>
              <List
                itemLayout="horizontal"
                className="project-list mt-4"
                dataSource={users}
                renderItem={(item) => (
                  <List.Item
                    actions={[<Link to="#">{item.profile.role}</Link>]}
                    onClick={() => this.goToUser(item._id)}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.profile.photo || UserAvatar} />}
                      title={
                        <b>{`${item.profile.first_name} ${item.profile.last_name}`}</b>
                      }
                      description={`country: ${item.profile.country || ""}`}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
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
