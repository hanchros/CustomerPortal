import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { getOrganization } from "../../actions/organization";
import OrgBasics from "./org_admin/basic";
import OrgEmailTemplate from "./org_admin/email-template";
import OrgTemplate from "./org_admin/template";
import OrgUsers from "./org_admin/users";
import Projects from "./org_admin/project";
import SelectTemplate from "../project/select-template";
import ProjectEdit from "../project/project-edit";

class AdminDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabId: "1",
      show_project_create: false,
      showProjEdit: false,
      curProj: {},
    };
  }

  componentDidMount = async () => {
    const { getOrganization, user } = this.props;
    if (!user.profile) return;
    await getOrganization(user.profile.org._id);
  };

  onToggleCreateProject = () => {
    this.setState({ show_project_create: !this.state.show_project_create });
  };

  onToggleProjEdit = (proj) => {
    this.setState({ showProjEdit: !this.state.showProjEdit, curProj: proj });
  };

  onChange = (tabId) => {
    this.setState({ tabId });
  };

  renderTabHeader = () => {
    const { tabId } = this.state;
    return (
      <div className="account-nav">
        <Container className="subnav-responsive">
          <Link
            to="#"
            onClick={() => this.onChange("1")}
            className={tabId === "1" ? "active" : ""}
          >
            <p>Organization profile</p>
          </Link>
          <Link
            to="#"
            onClick={() => this.onChange("2")}
            className={`${tabId === "2" ? "active" : ""} ml-4`}
          >
            <p>Projects</p>
          </Link>
          <Link
            to="#"
            onClick={() => this.onChange("3")}
            className={`${tabId === "3" ? "active" : ""} ml-4`}
          >
            <p>Users</p>
          </Link>
          <Link
            to="#"
            onClick={() => this.onChange("4")}
            className={`${tabId === "4" ? "active" : ""} ml-4`}
          >
            <p>Templates</p>
          </Link>
          <Link
            to="#"
            onClick={() => this.onChange("5")}
            className={`${tabId === "5" ? "active" : ""} ml-4`}
          >
            <p>Emails</p>
          </Link>
        </Container>
      </div>
    );
  };

  render() {
    const { tabId, show_project_create, showProjEdit, curProj } = this.state;
    const org = this.props.organization.currentOrganization;

    if (show_project_create)
      return <SelectTemplate goBack={this.onToggleCreateProject} />;

    if (showProjEdit) {
      return (
        <ProjectEdit
          goback={() => this.onToggleProjEdit({})}
          curProject={curProj}
        />
      );
    }

    return (
      <React.Fragment>
        <Header />
        {this.renderTabHeader()}
        {!org._id && (
          <div className="container sub-content">
            <Skeleton active loading={true} />
          </div>
        )}
        {org._id && this.props.orgAdmin && (
          <div className="container sub-content">
            {tabId === "1" && <OrgBasics />}
            {tabId === "2" && (
              <Projects
                onToggleCreateProject={this.onToggleCreateProject}
                onToggleEdit={this.onToggleProjEdit}
              />
            )}
            {tabId === "3" && <OrgUsers />}
            {tabId === "4" && <OrgTemplate />}
            {tabId === "5" && <OrgEmailTemplate />}
          </div>
        )}
        <Footer />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    orgAdmin: state.user.orgAdmin,
    organization: state.organization,
  };
};

export default connect(mapStateToProps, { getOrganization })(AdminDashboard);
