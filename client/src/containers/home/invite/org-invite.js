import React from "react";
import { connect } from "react-redux";
import { Skeleton, Result, Button } from "antd";
import HomeHOC from "../../../components/template/home-hoc";
import {
  getOrganization,
  acceptOrgMemberInvite,
  getOrgByName,
} from "../../../actions/organization";
import { registerInvitedUser } from "../../../actions/auth";
import history from "../../../history";
import { InviteRegisterForm } from "./invite-register";
import { getFieldData } from "../../../utils/helper";

class OrgInviteMember extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      isCreate: false,
      avatarURL: "",
      org: {},
    };
  }

  componentDidMount = async () => {
    const { match, getOrganization, getOrgByName } = this.props;
    const org_id = match.params.org_id;
    this.setState({ loading: true });
    const org = await getOrganization(org_id);
    this.setState({ org });
    await getOrgByName(org.org_name);
    this.setState({ loading: false });
  };

  onAcceptInvite = async () => {
    this.onToggleRegister();
  };

  onCancelInvite = () => {
    history.push("/");
  };

  onToggleRegister = () => {
    this.setState({ isCreate: !this.state.isCreate });
  };

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  onRegisterInvitedUser = async (values) => {
    const { registerInvitedUser } = this.props;
    await registerInvitedUser(values);
    history.push("/");
  };

  render() {
    const { loading, isCreate, avatarURL, org } = this.state;
    const { match, location, fieldData } = this.props;
    const userRoles = getFieldData(fieldData, "user_role");
    const params = new URLSearchParams(location.search);
    const values = {
      email: window.atob(match.params.email),
      organization: org.org_name,
      first_name: params.get("fn"),
      last_name: params.get("ln"),
      role: params.get("role"),
    };
    return (
      <HomeHOC>
        <div className="main-background-title">INVITATION</div>
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        {!loading && !isCreate && (
          <Result
            title="You are invited"
            subTitle="You can accept the invitation to join the organization, or ignore this invitation if you are not willing to join it"
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={this.onAcceptInvite}
              >
                Accept
              </Button>,
              <Button key="buy" onClick={this.onCancelInvite}>
                Cancel
              </Button>,
            ]}
          />
        )}
        {!loading && isCreate && (
          <InviteRegisterForm
            onSubmit={this.onRegisterInvitedUser}
            values={values}
            setAvatar={this.setAvatar}
            avatarURL={avatarURL}
            userRoles={userRoles}
          />
        )}
      </HomeHOC>
    );
  }
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {
  registerInvitedUser,
  getOrganization,
  acceptOrgMemberInvite,
  getOrgByName,
})(OrgInviteMember);
