import React, { Component } from "react";
import { connect } from "react-redux";
import { Skeleton } from "antd";
import {
  updateProject,
  getProject,
  listProjectDetails,
} from "../../actions/project";
import EditProjForm from "../../components/project/create_project";

class EditProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarURL: "",
      loading: false,
      curProject: {},
    };
  }

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    const curProject = await this.props.getProject(this.props.id);
    this.setState({ loading: false, curProject });
  };

  updateProject = async (projData) => {
    await this.props.updateProject(projData);
    this.props.hideModal();
    this.props.listProjectDetails();
  };

  render = () => {
    const { loading, curProject, avatarURL } = this.state;

    return (
      <div className="login-page">
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        {!loading && curProject._id && (
          <EditProjForm
            updateProject={this.updateProject}
            setAvatar={this.setAvatar}
            avatarURL={avatarURL || curProject.logo}
            curProject={curProject}
            hideProjectCreate={this.props.hideModal}
            fieldData={this.props.fieldData}
            label={this.props.label}
          />
        )}
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
    label: state.label
  };
}

export default connect(mapStateToProps, {
  listProjectDetails,
  updateProject,
  getProject,
})(EditProject);
