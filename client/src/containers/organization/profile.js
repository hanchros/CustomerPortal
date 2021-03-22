import React, { Component } from "react";
import { connect } from "react-redux";
import {
  updateOrganization,
  createOrganization,
} from "../../actions/organization";
import { Header } from "../../components/template";
import { getOrgTypesData } from "../../utils/helper";
import OrgEditForm from "./orgedit-form";
import history from "../../history";

class EditOrg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarURL: this.props.authOrg.logo,
    };
  }

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  onSubmitOrgProfile = async (orgData) => {
    const { updateOrganization, createOrganization } = this.props;
    if (orgData._id) {
      updateOrganization(orgData);
    } else {
      createOrganization(orgData);
    }
  };

  onCancel = () => {
    history.push("/organizations");
  };

  render = () => {
    const { fieldData, authOrg } = this.props;
    const orgTypes = getOrgTypesData(fieldData);

    return (
      <React.Fragment>
        <Header />
        <div className="login-page">
          <h1 className="mt-5">Create organization profile</h1>
          <OrgEditForm
            onSubmit={this.onSubmitOrgProfile}
            onCancel={this.onCancel}
            orgTypes={orgTypes}
            setAvatar={this.setAvatar}
            avatarURL={this.state.avatarURL || authOrg.logo}
            org={authOrg}
          />
        </div>
      </React.Fragment>
    );
  };
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
    authOrg: state.organization.currentOrganization,
  };
}

export default connect(mapStateToProps, {
  updateOrganization,
  createOrganization,
})(EditOrg);
