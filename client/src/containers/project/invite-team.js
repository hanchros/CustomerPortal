import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Form, Input, Select, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { sendInvite } from "../../actions/project";
import { Header } from "../../components/template";
import { listSimpleOrg } from "../../actions/organization";
import { ModalSpinner } from "../../components/pages/spinner";

const TeamInviteForm = ({ onSubmit, project }) => {
  const onFinish = (values) => {
    values.project_name = project.name;
    values.project_id = project._id;
    onSubmit(values);
  };
  return (
    <Form name="invite" className="register-form" onFinish={onFinish}>
      <h5 className="mb-3">Invite a new team member to join a project:</h5>
      <span>Name:</span>
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
      <span>Role:</span>
      <Form.Item
        name="project_role"
        rules={[
          {
            required: true,
            message: "Please input the role!",
          },
        ]}
      >
        <Input size="large" placeholder="Role" />
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

const ExTeamForm = ({ onSubmit, orgs, project }) => {
  const onFinish = (values) => {
    values.project_name = project.name;
    values.project_id = project._id;
    onSubmit(values);
  };
  return (
    <Form name="invite" className="register-form mt-5" onFinish={onFinish}>
      <h5 className="mb-3">Or invite existing user to join this project:​​</h5>
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
    };
  }

  componentDidMount = () => {
    this.props.listSimpleOrg();
  };

  onSendInvite = async (values) => {
    this.setState({ loading: true });
    await this.props.sendInvite(values);
    this.setState({ loading: false });
    this.props.goback();
  };

  render() {
    const { organization, project } = this.props;
    const orgs = organization.simpleOrgs;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Button className="mb-4" type="link" onClick={this.props.goback}>
            <ArrowLeftOutlined /> Back
          </Button>
          <TeamInviteForm
            onSubmit={this.onSendInvite}
            project={project.project}
          />
          <ExTeamForm
            onSubmit={this.onSendInvite}
            orgs={orgs}
            project={project.project}
          />
          <ModalSpinner visible={this.state.loading} />
        </Container>
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

export default connect(mapStateToProps, { sendInvite, listSimpleOrg })(Invite);
