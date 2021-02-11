import React, { Component } from "react";
import { connect } from "react-redux";
import { listProjectDetails, archiveProject } from "../../../actions/project";
import { RestOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  Collapse,
  Skeleton,
  Tooltip,
  Tag,
  List,
  Avatar,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import ChallengeIcon from "../../../assets/icon/challenge.png";
import UserIcon from "../../../assets/img/user-avatar.png";

const { Panel } = Collapse;

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

  renderDocHeader = (proj) => {
    return (
      <span>
        <b className="mr-5">{proj.name}</b>
        <Tag color="green">{proj.status}</Tag>
      </span>
    );
  };

  genExtra = (proj) => (
    <span
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <Tooltip title="Archive">
        <Popconfirm
          title="Are you sure archive this project?"
          onConfirm={() => this.onArchiveProject(proj._id)}
          okText="Yes"
          cancelText="No"
        >
          <RestOutlined style={{ color: "red" }} />
        </Popconfirm>
      </Tooltip>
    </span>
  );

  render() {
    const { project } = this.props;
    const { loading } = this.state;
    const projects = project.projectDetails;
    const liveProjects = projects.filter((proj) => proj.status !== "Archived");
    const archivedProjects = projects.filter(
      (proj) => proj.status === "Archived"
    );
    return (
      <div className="container">
        <h5 className="mr-auto mt-3">Projects</h5>
        <Collapse accordion>
          {liveProjects.map((proj) => (
            <Panel
              header={this.renderDocHeader(proj)}
              key={proj._id}
              extra={this.genExtra(proj)}
            >
              <div className="flex mb-4">
                <img
                  className="admin-project-logo"
                  src={proj.logo || ChallengeIcon}
                  alt=""
                />
                <div>
                  <span>Short Description:</span>
                  <p style={{ fontSize: "16px" }}>{proj.objective}</p>
                  <span>Create Date:</span>
                  <p style={{ fontSize: "16px" }}>
                    {moment(proj.createdAt).format("YYYY-MM-DD")}
                  </p>
                </div>
              </div>
              <span>Long Description:</span>
              <p style={{ fontSize: "16px" }}>{proj.description}</p>
              <span>Creator:</span>
              {proj.participant && (
                <List
                  itemLayout="horizontal"
                  dataSource={[proj.participant]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={item.profile.photo || UserIcon} />}
                        title={
                          <Link to="#">
                            <b>
                              {item.profile.first_name} {item.profile.last_name}
                            </b>
                          </Link>
                        }
                        description={`${item.profile.org_role || "member"} ${
                          item.profile.country || ""
                        }`}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Panel>
          ))}
        </Collapse>

        <h5 className="mr-auto mt-5">Archived Projects</h5>
        <Collapse accordion>
          {archivedProjects.map((proj) => (
            <Panel header={this.renderDocHeader(proj)} key={proj._id}>
              <div className="flex mb-4">
                <img
                  className="admin-project-logo"
                  src={proj.logo || ChallengeIcon}
                  alt=""
                />
                <div>
                  <span>Short Description:</span>
                  <p style={{ fontSize: "16px" }}>{proj.objective}</p>
                  <span>Create Date:</span>
                  <p style={{ fontSize: "16px" }}>
                    {moment(proj.createdAt).format("YYYY-MM-DD")}
                  </p>
                </div>
              </div>
              <span>Long Description:</span>
              <p style={{ fontSize: "16px" }}>{proj.description}</p>
              <span>Creator:</span>
              {proj.participant && (
                <List
                  itemLayout="horizontal"
                  dataSource={[proj.participant]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={item.profile.photo || UserIcon} />}
                        title={
                          <Link to="#">
                            <b>
                              {item.profile.first_name} {item.profile.last_name}
                            </b>
                          </Link>
                        }
                        description={`${item.profile.org_role || "member"} ${
                          item.profile.country || ""
                        }`}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Panel>
          ))}
        </Collapse>
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
      </div>
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
})(ProjectReport);
