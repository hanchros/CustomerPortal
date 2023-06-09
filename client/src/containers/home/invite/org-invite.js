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
    if (!org) return;
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
    const sender = org.creator ? org.creator.profile : {};
    return (
      <HomeHOC>
        <div className="flex-colume-center">
          <div className="main-background-title mb-2">Organization Invite</div>
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          {!loading && !isCreate && (
            <Result
              title="You are invited"
              style={{width: "80%"}}
              subTitle={
                <span>
                  {sender.first_name} {sender.last_name} invited to you join the
                  organization {org.org_name} on Collaborate.App.
                  <br /> Click the Accept button below to join {
                    org.org_name
                  }{" "}
                  and begin collaborating!
                </span>
              }
              extra={[
                <Button
                  type="primary"
                  key="console"
                  onClick={this.onAcceptInvite}
                >
                  Accept
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
        </div>
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
