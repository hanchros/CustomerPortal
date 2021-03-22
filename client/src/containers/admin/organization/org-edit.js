import React, { Component } from "react";
import { connect } from "react-redux";
import {
  updateOrganization,
  getOrganization,
  listOrgReport,
} from "../../../actions/organization";
import { getOrgTypesData } from "../../../utils/helper";
import OrgEditForm from "../../organization/orgedit-form";

class EditOrg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarURL: "",
    };
  }

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  updateOrg = async (orgData) => {
    await this.props.updateOrganization(orgData);
    this.props.hideModal();
    this.props.listOrgReport();
  };

  render = () => {
    const { fieldData, org, hideModal } = this.props;
    const orgTypes = getOrgTypesData(fieldData);
    const { avatarURL } = this.state;

    return (
      <div className="login-page">
        <OrgEditForm
          onSubmit={this.updateOrg}
          orgTypes={orgTypes}
          setAvatar={this.setAvatar}
          avatarURL={avatarURL || org.logo}
          org={org}
          fieldData={fieldData}
          onCancel={hideModal}
        />
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    organization: state.organization,
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {
  updateOrganization,
  getOrganization,
  listOrgReport,
})(EditOrg);
