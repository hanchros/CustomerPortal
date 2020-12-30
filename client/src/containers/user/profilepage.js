import React, { Component } from "react";
import { connect } from "react-redux";
import { listSimpleOrg } from "../../actions/organization";
import { updateProfile } from "../../actions/auth";
import { getFieldData } from "../../utils/helper";
import ProfileForm from "./profile-form";
import history from "../../history";
import HomeHOC from "../../components/template/home-hoc";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = { avatarURL: "" };
  }

  componentDidMount = () => {
    this.props.listSimpleOrg();
  };

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  onUpdateProfile = async (profile) => {
    delete profile.organization;
    delete profile.org_input;
    await this.props.updateProfile({ profile });
    history.push("/user-dashboard");
  };

  render = () => {
    const { user, organization, fieldData, label } = this.props;
    let profile = user.profile || {};
    profile.email = user.email;
    const roles = getFieldData(fieldData, "user_role");

    return (
      <HomeHOC>
        <div className="container ">
        <div className="main-background-title">Create a user profile</div>
          <ProfileForm
            onSubmit={this.onUpdateProfile}
            profile={profile}
            orgs={organization.simpleOrgs}
            setAvatar={this.setAvatar}
            avatarURL={this.state.avatarURL || profile.photo}
            roles={roles}
            fieldData={fieldData}
            label={label}
          />
        </div>
      </HomeHOC>
    );
  };
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    organization: state.organization,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
}

export default connect(mapStateToProps, { updateProfile, listSimpleOrg })(
  ProfilePage
);
