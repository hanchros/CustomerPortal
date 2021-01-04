import React from "react";
import { connect } from "react-redux";
import { Form, Input } from "antd";
import { Link } from "react-router-dom";

const RequestInviteForm = ({ onSubmit, sent }) => {
  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form name="register" className="login-form mt-5" onFinish={onFinish}>
      <Form.Item
        name="first_name"
        rules={[
          {
            required: true,
            message: "Please input your first name!",
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
            message: "Please input your last name!",
          },
        ]}
      >
        <Input size="large" placeholder="Last Name" />
      </Form.Item>
      <Form.Item name="organization">
        <Input size="large" placeholder="Organization Name" />
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
      <div className="signup-btn flex mt-5">
        <button type="submit" className="main-btn">
          Register
        </button>
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
    };
  }

  onRequestInvite = (values) => {
    console.log(values);
    this.setState({ sent: true });
  };

  render() {
    return (
      <React.Fragment>
        <div className="main-background-title">REQUEST INVITE</div>
        <RequestInviteForm
          onSubmit={this.onRequestInvite}
          sent={this.state.sent}
        />
        <div className="home-btn-group mt-big">
          <Link to="#" className="main-btn" onClick={this.props.goNext}>
            Next
          </Link>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {})(RequestInvite);
