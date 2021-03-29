import React, { Component } from "react";
import { connect } from "react-redux";
import { updateCompany } from "../../actions/softcompany";
import { getOrgTypesData } from "../../utils/helper";
import ProfileForm from "./profile-form";

class ProfilePage extends Component {
  onUpdateProfile = async (profile) => {
    await this.props.updateCompany({ profile });
  };

  render = () => {
    const { user, fieldData } = this.props;
    let profile = user.profile || {};
    profile.email = user.email;
    const orgTypes = getOrgTypesData(fieldData);
    return (
      <div className="container sub-content">
        <ProfileForm
          onSubmit={this.onUpdateProfile}
          profile={profile}
          orgTypes={orgTypes}
        />
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, { updateCompany })(ProfilePage);
