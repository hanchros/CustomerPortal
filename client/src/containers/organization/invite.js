import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Select, Form, Input, Modal } from "antd";
import {
  sendOrgMemberInvite,
  getInviteContent,
  getInviteEmailTemplate,
} from "../../actions/organization";
import { listMailByOrg } from "../../actions/mail";
import { ModalSpinner } from "../../components/pages/spinner";
import { getFieldData } from "../../utils/helper";

const InviteForm = ({ onSubmit, org, user, onCancel, roles }) => {
  const onFinish = async (values) => {
    values._id = org._id || null;
    values.organization = org.org_name;
    values.org_id = org._id;
    values.sender_name = `${user.profile.first_name} ${user.profile.last_name}`;
    values.encode_email = window.btoa(values.email);
    await onSubmit(values);
  };

  const onCancelInvite = (e) => {
    e.preventDefault();
    onCancel();
  };

  return (
    <Form name="org_invite" className="login-form" onFinish={onFinish}>
      <div className="account-form-box">
        <h5 className="mb-5">Send Invitation</h5>
        <span className="form-label">First name*</span>
        <Form.Item
          name="first_name"
          rules={[
            {
              required: true,
              message: "Please input the first name!",
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>
        <span className="form-label">Last name*</span>
        <Form.Item
          name="last_name"
          rules={[
            {
              required: true,
              message: "Please input the last name!",
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>
        <span className="form-label">Email*</span>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input the email!",
            },
          ]}
        >
          <Input type="email" size="large" />
        </Form.Item>
        <span className="form-label">Role in organization*</span>
        <Form.Item
          name="role"
          rules={[
            {
              required: true,
              message: "Please select the role!",
            },
          ]}
        >
          <Select size="large">
            {roles.map((item) => (
              <Select.Option key={item._id} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
        <Button
          type="ghost"
          onClick={onCancelInvite}
          className="ghost-btn"
        >
          Cancel
        </Button>
        <Button type="ghost" htmlType="submit" className="black-btn ml-3">
          Continue
        </Button>
      </div>
    </Form>
  );
};

class OrgInvitePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      content: "",
      formVaule: {},
    };
  }

  componentDidMount = async () => {
    const { listMailByOrg, organization } = this.props;
    listMailByOrg(organization.currentOrganization._id);
  };

  onSendOrgInvite = async () => {
    this.setState({ loading: true });
    await this.props.sendOrgMemberInvite(this.state.formVaule);
    this.setState({ loading: false });
    this.onHidePreview();
    this.props.goBack();
  };

  onShowPreview = async (values) => {
    const {
      organization,
      getInviteContent,
      getInviteEmailTemplate,
    } = this.props;
    this.setState({ loading: true });
    values.content = getInviteContent(values);
    values.logo =
      organization.currentOrganization.logo ||
      "https://clientintegration-integra.s3.us-west-2.amazonaws.com/6045ab2a-37ea-44c5-b04f-06aeb318fd4e.png";
    const mail = await getInviteEmailTemplate(values);
    this.setState({
      loading: false,
      visible: true,
      content: mail.html,
      formVaule: values,
    });
  };

  onHidePreview = () => {
    this.setState({ visible: false });
  };

  render() {
    const { organization, user, fieldData, goBack } = this.props;
    const { loading, visible, content } = this.state;
    const roles = getFieldData(fieldData, "user_role");

    return (
      <div className="flex-colume-center">
        <InviteForm
          onSubmit={this.onShowPreview}
          user={user}
          org={organization.currentOrganization}
          onCancel={goBack}
          roles={roles}
        />
        {visible && (
          <Modal
            title={"Preview Invite Mail"}
            visible={visible}
            width={600}
            footer={false}
            onCancel={this.onHidePreview}
          >
            <div
              style={{ border: "1px solid #4472c4" }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <div className="flex mt-4">
              <Button
                type="primary"
                onClick={this.onSendOrgInvite}
                className="mr-4"
              >
                Send
              </Button>
              <Button onClick={this.onHidePreview}>Cancel</Button>
            </div>
            <ModalSpinner visible={loading} />
          </Modal>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    organization: state.organization,
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {
  sendOrgMemberInvite,
  getInviteContent,
  getInviteEmailTemplate,
  listMailByOrg,
})(OrgInvitePage);
