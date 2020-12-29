import React, { Component } from "react";
import { connect } from "react-redux";
import { updateOrganization } from "../../actions/organization";
import Logo from "../../assets/img/logo-dark.png";
import { Header, Footer } from "../../components/template";
import { getFieldData } from "../../utils/helper";
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

  updateOrg = async (orgData) => {
    await this.props.updateOrganization(orgData);
    history.push("/org-dashboard");
  };

  render = () => {
    const { fieldData, authOrg, label } = this.props;
    const orgTypes = getFieldData(fieldData, "org_type");

    return (
      <React.Fragment>
        <Header />
        <div className="login-page">
          <img className="mb-2 mt-4" src={Logo} alt="logo" />
          <h1 className="mt-3 mb-4">{label.titleOrganization} Profile</h1>
          {authOrg.org_name && (
            <OrgEditForm
              onSubmit={this.updateOrg}
              orgTypes={orgTypes}
              setAvatar={this.setAvatar}
              avatarURL={this.state.avatarURL || authOrg.logo}
              org={authOrg}
              fieldData={fieldData}
              label={label}
            />
          )}
        </div>
        <Footer />
      </React.Fragment>
    );
  };
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
    authOrg: state.organization.authOrg,
    label: state.label,
  };
}

export default connect(mapStateToProps, { updateOrganization })(EditOrg);
