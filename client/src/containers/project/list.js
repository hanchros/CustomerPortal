import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import { Skeleton, List, Avatar } from "antd";
import { listProjects } from "../../actions/project";
import { Header, Footer } from "../../components/template";
import ChallengeLogo from "../../assets/icon/challenge.png";
import history from "../../history";

class ProjectList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount = async () => {
    const { project, listProjects } = this.props;
    if (!project.projects || project.projects.length === 0) {
      this.setState({ loading: true });
      await listProjects();
      this.setState({ loading: false });
    }
  };

  goToProject = (item) => {
    history.push(`/project/${item._id}`);
  };

  render() {
    const projects = this.props.project.projects;
    const { loading } = this.state;

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Link
            className="main-btn mb-4"
            to={`/${this.props.curOrg.org_name}/select-template`}
          >
            Create New
          </Link>
          <List
            itemLayout="horizontal"
            className="project-list mt-4"
            dataSource={projects}
            renderItem={(item) => (
              <List.Item onClick={() => this.goToProject(item)}>
                <List.Item.Meta
                  avatar={<Avatar src={item.logo || ChallengeLogo} />}
                  title={
                    <span>
                      <b>{item.name}</b>
                      <i
                        className="online-symbol ml-5"
                        style={{ fontSize: "14px" }}
                      >
                        ●
                      </i>
                      {item.status}
                    </span>
                  }
                  description={
                    <span>
                      {item.participant && (
                        <span>
                          {item.participant.profile.first_name}{" "}
                          {item.participant.profile.last_name} -{" "}
                          {item.participant.profile.org_name}
                        </span>
                      )}
                      <br />
                      {item.description}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
          <Skeleton active loading={loading} />
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    project: state.project,
    curOrg: state.organization.currentOrganization,
    orgSettings: state.organization.orgSettings,
  };
}

export default connect(mapStateToProps, {
  listProjects,
})(ProjectList);
