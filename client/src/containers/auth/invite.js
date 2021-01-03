import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Form, Input, Select } from "antd";
import { sendInvite } from "../../actions/auth";
import { Header } from "../../components/template";
import { listSimpleOrg } from "../../actions/organization";
import RichTextEditor from "../../components/pages/editor";

const InviteForm = ({ onSubmit, orgs }) => {
  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      name="invite"
      className="invite-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
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
      <Form.Item name="content">
        <RichTextEditor placeholder="Content" />
      </Form.Item>
      <div className="signup-btn mt-5">
        <button type="submit" className="main-btn">
          Send
        </button>
      </div>
    </Form>
  );
};

class Invite extends Component {
  constructor() {
    super();

    this.state = {
      show_result: false,
      content: "",
    };
  }

  componentDidMount = () => {
    this.props.listSimpleOrg();
  };

  onSendInvite = async (values) => {
    const result = await this.props.sendInvite(values);
    this.setState({ show_result: true, content: result });
  };

  render() {
    const { organization } = this.props;
    const { show_result, content } = this.state;
    const orgs = organization.simpleOrgs;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="invite-title">
            <h1>Send Invitation</h1>
          </div>
          {!show_result && (
            <InviteForm onSubmit={this.onSendInvite} orgs={orgs} />
          )}
          {show_result && <div dangerouslySetInnerHTML={{ __html: content }} />}
        </Container>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    organization: state.organization,
  };
}

export default connect(mapStateToProps, { sendInvite, listSimpleOrg })(Invite);
