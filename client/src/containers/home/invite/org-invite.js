import React from "react";
import { connect } from "react-redux";
import { Skeleton, Result, Button } from "antd";
import HomeHOC from "../../../components/template/home-hoc";
import {
  getOrganization,
  acceptOrgMemberInvite,
  getOrgByName,
} from "../../../actions/organization";
import { fetchUserByEmail } from "../../../actions/user";
import { registerInvitedUser } from "../../../actions/auth";
import history from "../../../history";
import { InviteRegisterForm } from "./invite-register";
import { getFieldData } from "../../../utils/helper";

class OrgInviteMember extends React.Component {
  constructor() {
    super();

    this.state = {
      exuser: false,
      loading: false,
      isCreate: false,
      avatarURL: "",
      org: {},
    };
  }

  componentDidMount = async () => {
    const {
      match,
      getOrganization,
      fetchUserByEmail,
      getOrgByName,
    } = this.props;
    const org_id = match.params.org_id;
    const email = window.atob(match.params.email);
    this.setState({ loading: true });
    const org = await getOrganization(org_id);
    this.setState({ org });
    await getOrgByName(org.org_name);
    const exuser = await fetchUserByEmail(email);
    this.setState({ loading: false, exuser });
  };

  onAcceptInvite = async () => {
    const { exuser } = this.state;
    const { acceptOrgMemberInvite, organization } = this.props;
    const org = organization.currentOrganization;
    if (exuser && exuser._id) {
      await acceptOrgMemberInvite({
        userId: exuser._id,
        orgId: org._id,
        org_name: org.org_name,
      });
      history.push(`/${org.org_name}`);
    } else {
      this.onToggleRegister();
    }
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
    const { loading, isCreate, avatarURL } = this.state;
    const { match, organization, fieldData } = this.props;
    const org = organization.currentOrganization;
    const userRoles = getFieldData(fieldData, "user_role");
    const values = {
      email: window.atob(match.params.email),
      organization: org.org_name,
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
    organization: state.organization,
  };
}

export default connect(mapStateToProps, {
  registerInvitedUser,
  getOrganization,
  fetchUserByEmail,
  acceptOrgMemberInvite,
  getOrgByName,
})(OrgInviteMember);
