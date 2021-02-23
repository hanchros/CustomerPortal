import React from "react";
import { connect } from "react-redux";
import { Button, Form, Input } from "antd";
import { createInviteRequest } from "../../../actions/invite";
import { ModalSpinner } from "../../../components/pages/spinner";

const RequestInviteForm = ({ onSubmit, sent }) => {
  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form name="register" className="login-form" onFinish={onFinish}>
      <span className="form-label">First name*</span>
      <Form.Item
        name="first_name"
        rules={[
          {
            required: true,
            message: "Please input your first name!",
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
            message: "Please input your last name!",
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>
      <span className="form-label">Organization</span>
      <Form.Item name="organization">
        <Input size="large" />
      </Form.Item>
      <span className="form-label">Email*</span>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input size="large" type="email" />
      </Form.Item>
      <div className="flex mt-4">
        <Button type="ghost" htmlType="submit" className="black-btn" style={{width: "120px"}}>
          Send
        </Button>
        {sent && <p className="ml-4">Please check your email</p>}
      </div>
    </Form>
  );
};

class RequestInvite extends React.Component {
  constructor() {
    super();

    this.state = {
      sent: false,
      loading: false,
    };
  }

  onRequestInvite = async (values) => {
    this.setState({ loading: true });
    await this.props.createInviteRequest(values);
    this.setState({ sent: true, loading: false });
  };

  render() {
    const { sent, loading } = this.state;
    return (
      <div className="flex-colume-center">
        <div className="account-form-box mb-4">
          <div className="center mb-4">
            <h3>
              <b>REQUEST INVITE</b>
            </h3>
          </div>
          <RequestInviteForm onSubmit={this.onRequestInvite} sent={sent} />
          <Button type="link" className="mt-5" onClick={this.props.goNext}>
            Go Back
          </Button>
          <ModalSpinner visible={loading} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { createInviteRequest })(RequestInvite);
