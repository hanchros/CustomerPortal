import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input } from "antd";
import { getForgotPasswordToken } from "../../actions/auth";
import history from "../../history";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";

const ForgotForm = ({ sendMail }) => {
  const onFinish = (values) => {
    sendMail(values.email);
  };

  return (
    <Form name="forgot" className="login-form" onFinish={onFinish}>
      <div className="auth-title mb-4">
        <div />
        <Link to="/">Back to Home</Link>
      </div>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input type="email" size="large" placeholder="Email" />
      </Form.Item>
      <button type="submit" className="main-btn mt-5">
        Reset Password
      </button>
    </Form>
  );
};

class ForgotPassword extends Component {
  componentDidMount() {
    if (this.props.authenticated) {
      history.push("/dashboard");
      return;
    }
  }

  render() {
    return (
      <HomeHOC>
        <div className="main-background-title">Forgot Password</div>
        <ForgotForm sendMail={this.props.getForgotPasswordToken} />
      </HomeHOC>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, {
  getForgotPasswordToken,
})(ForgotPassword);
