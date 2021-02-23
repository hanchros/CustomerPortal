import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, Input } from "antd";
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
      <div className="auth-title">
        <div />
        <Link to="/" className="underline-link">
          Back to Home
        </Link>
      </div>
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
        <Input type="email" size="large" />
      </Form.Item>
      <Button type="ghost" htmlType="submit" className="black-btn wide mt-5">
        Reset Password
      </Button>
    </Form>
  );
};

class ForgotPassword extends Component {
  componentDidMount() {
    if (this.props.authenticated) {
      history.push("/");
      return;
    }
  }

  render() {
    return (
      <HomeHOC>
        <div className="flex-colume-center">
          <div className="account-form-box mb-4">
            <div className="center mb-4">
              <h3>
                <b>Forgot Password</b>
              </h3>
            </div>
            <ForgotForm sendMail={this.props.getForgotPasswordToken} />
          </div>
        </div>
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
