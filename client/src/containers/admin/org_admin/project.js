import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  listProjectDetails,
  archiveProject,
  unArchiveProject,
} from "../../../actions/project";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { Row, Col } from "reactstrap";
import { Skeleton, Avatar, Popconfirm, Button, Popover } from "antd";
import OrgLogo from "../../../assets/icon/challenge.png";
import NonList from "../../../components/pages/non-list";

class ProjectReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount = async () => {
    const { organization, listProjectDetails } = this.props;
    const curOrg = organization.currentOrganization;
    this.setState({ loading: true });
    await listProjectDetails(curOrg._id);
    this.setState({ loading: false });
  };

  onArchiveProject = async (id) => {
    const { organization, listProjectDetails, archiveProject } = this.props;
    const curOrg = organization.currentOrganization;
    await archiveProject(id);
    listProjectDetails(curOrg._id);
  };

  onUnArchiveProject = async (id) => {
    const { organization, listProjectDetails, unArchiveProject } = this.props;
    const curOrg = organization.currentOrganization;
    await unArchiveProject(id);
    listProjectDetails(curOrg._id);
  };

  renderAction = (proj) => {
    let content = (
      <div className="blue-popover">
        <ul>
          <li onClick={() => this.props.onToggleEdit(proj)}>EDIT PROJECT</li>
          <li>
            <Popconfirm
              title="Are you sure archive this project?"
              onConfirm={() => this.onArchiveProject(proj._id)}
              okText="Yes"
              cancelText="No"
            >
              ARCHIVE PROJECT
            </Popconfirm>
          </li>
        </ul>
      </div>
    );
    return (
      <Popover placement="bottomRight" content={content} trigger="click">
        <Link to="#">
          <MoreOutlined />
        </Link>
      </Popover>
    );
  };

  renderArchiveAction = (proj) => {
    let content = (
      <div className="blue-popover">
        <ul>
          <li onClick={() => this.onUnArchiveProject(proj._id)}>
            UNARCHIVE PROJECT
          </li>
        </ul>
      </div>
    );
    return (
      <Popover placement="bottomRight" content={content} trigger="click">
        <Link to="#">
          <MoreOutlined />
        </Link>
      </Popover>
    );
  };

  render() {
    const { project, onToggleCreateProject } = this.props;
    const { loading } = this.state;
    const projects = project.projectDetails;
    const liveProjects = projects.filter((proj) => proj.status !== "Archived");
    const archivedProjects = projects.filter(
      (proj) => proj.status === "Archived"
    );

    return (
      <React.Fragment>
        <h3>
          <b>Projects</b>
        </h3>
        <hr className="mt-4 mb-4" />
        <div className="flex mb-2" style={{ justifyContent: "flex-end" }}>
          <Button
            onClick={onToggleCreateProject}
            type="ghost"
            className="black-btn"
          >
            <PlusOutlined /> create project
          </Button>
        </div>
        <Row className="mb-5">
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
            {liveProjects.map((proj) => (
              <div className="project-table-item" key={proj._id}>
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
                <div className="cell0">{this.renderAction(proj)}</div>
              </div>
            ))}
          </Col>
        </Row>
        {archivedProjects.length > 0 && (
          <React.Fragment>
            <h5>
              <b>Archived projects</b>
            </h5>
            <hr className="mt-4 mb-4" />
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
                {archivedProjects.map((proj) => (
                  <div className="project-table-item" key={proj._id}>
                    <div className="cell0">
                      <Avatar src={proj.logo || OrgLogo} />
                    </div>
                    <div className="cell0">
                      <p>
                        <b>{proj.name}</b>
                      </p>
                      <span>{proj.objective}</span>
                    </div>
                    <div className="cell0">
                      {proj.participant.profile.org_name}
                    </div>
                    <div className="cell0">
                      {proj.participant.profile.first_name}{" "}
                      {proj.participant.profile.last_name}
                    </div>
                    <div className="cell0">
                      {this.renderArchiveAction(proj)}
                    </div>
                  </div>
                ))}
              </Col>
            </Row>
          </React.Fragment>
        )}
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
    organization: state.organization,
    project: state.project,
  };
}

export default connect(mapStateToProps, {
  listProjectDetails,
  archiveProject,
  unArchiveProject,
})(ProjectReport);
