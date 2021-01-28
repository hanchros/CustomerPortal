import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Form, Input, Select, Button, Modal } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { sendInvite, joinOrgProject } from "../../actions/project";
import { Header, Footer } from "../../components/template";
import { listSimpleOrg } from "../../actions/organization";
import { listMailByOrg } from "../../actions/mail";
import {
  getInviteContent,
  getInviteEmailTemplate,
} from "../../actions/project";
import { ModalSpinner } from "../../components/pages/spinner";

const OrgInviteForm = ({ onSubmit, project }) => {
  const onFinish = (values) => {
    values.project_name = project.name;
    values.project_id = project._id;
    onSubmit(values);
  };
  return (
    <Form name="invite" className="register-form" onFinish={onFinish}>
      <h5 className="mb-3">Invite a new organization to join a project:​</h5>
      <span>Organization name:</span>
      <Form.Item
        name="organization"
        rules={[
          {
            required: true,
            message: "Please input the organization!",
          },
        ]}
      >
        <Input size="large" placeholder="Organization" />
      </Form.Item>
      <span>Leader:</span>
      <Form.Item
        name="first_name"
        rules={[
          {
            required: true,
            message: "Please input first name!",
          },
        ]}
      >
        <Input size="large" placeholder="First Name" />
      </Form.Item>
      <Form.Item
        name="last_name"
        rules={[
          {
            required: true,
            message: "Please input last name!",
          },
        ]}
      >
        <Input size="large" placeholder="Last Name" />
      </Form.Item>
      <span>E-mail:</span>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input size="large" type="email" placeholder="E-mail" />
      </Form.Item>
      <div className="signup-btn mt-4">
        <button type="submit" className="main-btn template-btn">
          Invite
        </button>
      </div>
    </Form>
  );
};

const ExOrgForm = ({ onSubmit, orgs, project }) => {
  const onFinish = (values) => {
    values.project_id = project._id;
    onSubmit(values);
  };
  return (
    <Form name="invite" className="register-form mt-5" onFinish={onFinish}>
      <h5 className="mb-3">Or invite existing user to join this project:​</h5>
      <Form.Item
        name="organization"
        rules={[
          {
            required: true,
            message: "Please choose the organization!",
          },
        ]}
      >
        <Select placeholder="Organization" size="large">
          {orgs.length > 0 &&
            orgs.map((item, index) => {
              return (
                <Select.Option key={index} value={item._id}>
                  {item.org_name}
                </Select.Option>
              );
            })}
        </Select>
      </Form.Item>
      <div className="signup-btn mt-4">
        <button type="submit" className="main-btn template-btn">
          Invite
        </button>
      </div>
    </Form>
  );
};

class Invite extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      visible: false,
      content: "",
      formVaule: {},
    };
  }

  componentDidMount = () => {
    const { organization, listSimpleOrg, listMailByOrg } = this.props;
    listSimpleOrg();
    listMailByOrg(organization.currentOrganization._id);
  };

  onSendOrgInvite = async () => {
    this.setState({ loading: true });
    await this.props.sendInvite(this.state.formVaule);
    this.setState({ loading: false });
    this.onHidePreview();
    this.props.goback();
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
    values.sender_organization = organization.currentOrganization.org_name
    const mail = await getInviteEmailTemplate(values);
    this.setState({
      loading: false,
      visible: true,
      content: mail.html,
      formVaule: values,
    });
  };

  onJoinOrg = async (values) => {
    this.setState({ loading: true });
    await this.props.joinOrgProject(values.project_id, values.organization);
    this.setState({ loading: false });
    this.props.goback();
  };

  onHidePreview = () => {
    this.setState({ visible: false });
  };

  render() {
    const { organization, project } = this.props;
    const { loading, visible, content } = this.state;
    const orgs = organization.simpleOrgs;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Button className="mb-4" type="link" onClick={this.props.goback}>
            <ArrowLeftOutlined /> Back
          </Button>
          <OrgInviteForm
            onSubmit={this.onShowPreview}
            project={project.project}
          />
          <ExOrgForm
            onSubmit={this.onJoinOrg}
            orgs={orgs}
            project={project.project}
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
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    project: state.project,
    organization: state.organization,
  };
}

export default connect(mapStateToProps, {
  sendInvite,
  listSimpleOrg,
  joinOrgProject,
  listMailByOrg,
  getInviteContent,
  getInviteEmailTemplate,
})(Invite);
