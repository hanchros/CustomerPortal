import React from "react";
import { connect } from "react-redux";
import { Input } from "antd";
import { Link } from "react-router-dom";
import { getProject } from "../../../actions/project";
import { createOrganization } from "../../../actions/organization";
import ChallengeLogo from "../../../assets/icon/challenge.png";
import { Upload } from "../../../components/template";

class ProjectRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarURL: "",
      webaddr: "",
    };
  }

  componentDidMount = () => {
    const { auth } = this.props;
    if (auth.pdfData.project_id) {
      this.props.getProject(auth.pdfData.project_id);
    }
  };

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  onChangeWebAddr = (e) => {
    this.setState({ webaddr: e.target.value });
  };

  onGoNext = () => {
    const { auth, user, goBack } = this.props;
    const { avatarURL, webaddr } = this.state;
    if (auth.pdfData.organization && !user.profile.org) {
      this.props.createOrganization({
        org_name: auth.pdfData.organization,
        creator: user._id,
        social: webaddr,
        logo: avatarURL,
      });
    }
    goBack();
  };

  render() {
    const { auth, project, user } = this.props;
    const { avatarURL, webaddr } = this.state;
    const curProj = project.project;
    const pdfData = auth.pdfData;
    return (
      <React.Fragment>
        <div className="main-background-title">REGISTRATION</div>
        <div className="project-box">
          <p className="mt-5">Explanation and overview of process</p>
          <p className="mt-3">You have been invited to join this project:​</p>
          <div className="register-project-view">
            <div>
              <img src={curProj.logo || ChallengeLogo} alt="" />
            </div>
            <div>
              <p>
                <b>{curProj.name}</b>
              </p>
              <span>{curProj.description}</span>
            </div>
          </div>
          {pdfData.organization && !user.profile.org && (
            <div className="project-org-createbox">
              <p>Please complete your organization details:</p>
              <span>Name:</span>
              <Input className="mb-4" value={pdfData.organization} disabled />
              <span>Web Address:</span>
              <Input
                className="mb-4"
                value={webaddr}
                onChange={this.onChangeWebAddr}
              />
              <span>logo:</span>
              <div className="avatar-uploader mb-4">
                <Upload setAvatar={this.setAvatar} imageUrl={avatarURL} />
              </div>
            </div>
          )}
        </div>
        <Link to="#" className="main-btn mt-5" onClick={this.onGoNext}>
          Next
        </Link>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
    project: state.project,
    auth: state.auth,
    user: state.user.profile,
  };
}

export default connect(mapStateToProps, { getProject, createOrganization })(
  ProjectRegister
);
