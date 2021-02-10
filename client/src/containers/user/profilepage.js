import React, { Component } from "react";
import { connect } from "react-redux";
import { listSimpleOrg } from "../../actions/organization";
import { updateProfile } from "../../actions/auth";
import { getFieldData } from "../../utils/helper";
import ProfileForm from "./profile-form";

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
  };

  render = () => {
    const { user, organization, fieldData } = this.props;
    let profile = user.profile || {};
    profile.email = user.email;
    const roles = getFieldData(fieldData, "user_role");

    return (
      <div className="container ">
        <h1 className="mt-5 mb-4 center">My Profile</h1>
        <ProfileForm
          onSubmit={this.onUpdateProfile}
          profile={profile}
          orgs={organization.simpleOrgs}
          setAvatar={this.setAvatar}
          avatarURL={this.state.avatarURL || profile.photo}
          roles={roles}
          fieldData={fieldData}
        />
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    organization: state.organization,
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, { updateProfile, listSimpleOrg })(
  ProfilePage
);
