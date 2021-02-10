import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import {
  Button,
  List,
  Popconfirm,
  PageHeader,
  Descriptions,
  Select,
  Form,
  Input,
  Modal,
} from "antd";
import moment from "moment";
import {
  listOrgUsers,
  addOrgUser,
  removeOrgUser,
  changeUserOrgRole,
  sendOrgMemberInvite,
  getInviteContent,
  getInviteEmailTemplate,
} from "../../../actions/organization";
import { listMailByOrg } from "../../../actions/mail";
import { ModalSpinner } from "../../../components/pages/spinner";
import UserAvatar from "../../../assets/img/user-avatar.png";
import ChallengeImg from "../../../assets/icon/challenge.png";
import Avatar from "antd/lib/avatar/avatar";

const Option = Select.Option;

const InviteForm = ({ onSubmit, org, user, onCancel }) => {
  const onFinish = async (values) => {
    values._id = org._id || null;
    values.organization = org.org_name;
    values.org_id = org._id;
    values.sender_name = `${user.profile.first_name} ${user.profile.last_name}`;
    values.encode_email = window.btoa(values.email);
    await onSubmit(values);
  };

  return (
    <Form name="org_invite" className="org-form mt-5" onFinish={onFinish}>
      <h5 className="mb-5">Send Invitation</h5>
      <Form.Item
        name="first_name"
        rules={[
          {
            required: true,
            message: "Please input the first name!",
          },
        ]}
      >
        <Input placeholder="First Name" size="large" />
      </Form.Item>
      <Form.Item
        name="last_name"
        rules={[
          {
            required: true,
            message: "Please input the last name!",
          },
        ]}
      >
        <Input placeholder="Last Name" size="large" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input the email!",
          },
        ]}
      >
        <Input placeholder="E-mail" type="email" size="large" />
      </Form.Item>
      <Form.Item
        name="role"
        rules={[
          {
            required: true,
            message: "Please input the role!",
          },
        ]}
      >
        <Input placeholder="Role" type="text" size="large" />
      </Form.Item>
      <div className="signup-btn">
        <Button type="primary" className="mr-3" htmlType="submit">
          Submit
        </Button>
        <Button
          type="default"
          onClick={(e) => {
            e.preventDefault();
            onCancel();
          }}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

class AdminUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showUserDetail: false,
      curUser: {},
      curRole: "member",
      showInviteForm: false,
      loading: false,
      visible: false,
      content: "",
      formVaule: {},
    };
  }

  componentDidMount = async () => {
    const { listOrgUsers, listMailByOrg, organization } = this.props;
    listOrgUsers(organization.currentOrganization._id);
    listMailByOrg(organization.currentOrganization._id);
  };

  onToggleShowUser = (user) => {
    this.setState({
      showUserDetail: !this.state.showUserDetail,
      curUser: user || {},
      curRole: (user && user.profile.org_role) || "member",
    });
  };

  onToggleShowInvite = () => {
    this.setState({
      showInviteForm: !this.state.showInviteForm,
    });
  };

  onChangeRole = (role) => {
    this.setState({ curRole: role });
  };

  onRemoveUser = async (id) => {
    const { removeOrgUser, organization } = this.props;
    await removeOrgUser(id);
    listOrgUsers(organization.currentOrganization._id);
  };

  onAddUser = async (id) => {
    const { addOrgUser, organization } = this.props;
    const org = organization.currentOrganization;
    await addOrgUser(id, org._id);
    listOrgUsers(org._id);
  };

  onSaveChangeRole = async () => {
    const { curRole, curUser } = this.state;
    const org = this.props.organization.currentOrganization;
    await this.props.changeUserOrgRole(curUser._id, curRole);
    listOrgUsers(org._id);
  };

  renderUserItem = (user) => (
    <List.Item
      className="admin-org-template"
      actions={[
        <Popconfirm
          key={user._id}
          title="Are you sure to remove this user?"
          onConfirm={() => this.onRemoveUser(user._id)}
        >
          <Button type="link">Remove</Button>
        </Popconfirm>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={user.profile.photo || UserAvatar} />}
        title={`${user.profile.first_name} ${user.profile.last_name}`}
        description={`role: ${user.profile.org_role}, country: ${
          user.profile.country || ""
        }`}
        onClick={() => this.onToggleShowUser(user)}
      />
    </List.Item>
  );

  renderProjectItem = (pm) => {
    if (!pm.project) return null;
    return (
      <List.Item className="admin-org-template">
        <List.Item.Meta
          avatar={<Avatar src={pm.project.logo || ChallengeImg} />}
          title={pm.project.name}
          description={pm.project.description}
        />
      </List.Item>
    );
  };

  renderUserDetails = (user) => (
    <React.Fragment>
      <div className="admin-org-headerbox">
        <div>
          <img
            src={user.profile.photo || UserAvatar}
            alt=""
            className="admin-org-userlogo"
          />
        </div>
        <div>
          <span className="ml-4">Change Role:</span>
          <div className="admin-org-rolebox">
            <Select
              style={{ width: 200 }}
              placeholder="Select a role"
              onChange={this.onChangeRole}
              value={this.state.curRole}
            >
              <Option value="admin">admin</Option>
              <Option value="member">member</Option>
            </Select>
            <Button type="primary" onClick={this.onSaveChangeRole}>
              Save
            </Button>
          </div>
        </div>
      </div>
      <PageHeader
        className="mb-5"
        ghost={false}
        title={`${user.profile.first_name} ${user.profile.last_name}`}
        extra={[
          <Button key={2} onClick={() => this.onToggleShowUser()}>
            Back
          </Button>,
        ]}
      >
        <Descriptions size="default" column={2}>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Country">
            {user.profile.country}
          </Descriptions.Item>
          <Descriptions.Item label="Organization">
            {user.profile.org_name}
          </Descriptions.Item>
          <Descriptions.Item label="Organization Role">
            {user.profile.org_role}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {user.profile.address}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {user.profile.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Personal Statement">
            {user.profile.personal_statement}
          </Descriptions.Item>
          <Descriptions.Item label="Twitter">
            {user.profile.twitter}
          </Descriptions.Item>
          <Descriptions.Item label="Linkedin">
            {user.profile.linkedin}
          </Descriptions.Item>
          <Descriptions.Item label="Facebook">
            {user.profile.facebook}
          </Descriptions.Item>
          <Descriptions.Item label="Web">{user.profile.web}</Descriptions.Item>
          <Descriptions.Item label="Register Date">
            {moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <span className="ml-4">Associated projects:</span>
      <List
        size="large"
        dataSource={user.projects}
        itemLayout="horizontal"
        renderItem={this.renderProjectItem}
      />
    </React.Fragment>
  );

  onSendOrgInvite = async () => {
    this.setState({ loading: true });
    await this.props.sendOrgMemberInvite(this.state.formVaule);
    this.setState({ loading: false });
    this.onHidePreview();
    this.onToggleShowInvite();
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
      "https://hackathon-cretech.s3.us-east-2.amazonaws.com/7e68ac9b-cc75-4d15-a8e1-a07a9e48bc90.png";
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
    const { organization, user } = this.props;
    const {
      showUserDetail,
      curUser,
      showInviteForm,
      loading,
      visible,
      content,
    } = this.state;

    const users = organization.users;
    return (
      <Container className="admin-org-box">
        {showUserDetail && this.renderUserDetails(curUser)}
        {showInviteForm && (
          <InviteForm
            onSubmit={this.onShowPreview}
            user={user}
            org={organization.currentOrganization}
            onCancel={this.onToggleShowInvite}
          />
        )}
        {!showUserDetail && !showInviteForm && (
          <React.Fragment>
            <List
              size="large"
              dataSource={users}
              itemLayout="horizontal"
              renderItem={this.renderUserItem}
            />
            <button
              className="main-btn template-btn mt-5 ml-4"
              onClick={this.onToggleShowInvite}
            >
              Add User
            </button>
          </React.Fragment>
        )}
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
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    organization: state.organization,
  };
}

export default connect(mapStateToProps, {
  listOrgUsers,
  removeOrgUser,
  addOrgUser,
  changeUserOrgRole,
  sendOrgMemberInvite,
  getInviteContent,
  getInviteEmailTemplate,
  listMailByOrg,
})(AdminUsers);
