import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, Input } from "antd";
import { getForgotPasswordToken } from "../../actions/auth";
import history from "../../history";
import HomeHOC from "../../components/template/home-hoc";

const ForgotForm = ({ sendMail }) => {
  const onFinish = (values) => {
    sendMail(values.email);
  };

  const goBack = (e) => {
    e.preventDefault();
    history.push("/login");
  };

  return (
    <Form name="forgot" onFinish={onFinish}>
      <span className="form-label">Email address</span>
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
      <p>The reset password link will be sent to your email address.</p>
      <Button
        type="ghost"
        htmlType="submit"
        className="black-btn mt-5"
        style={{ width: "100%" }}
      >
        Reset Password
      </Button>
      <Button
        type="ghost"
        className="ghost-btn mt-3"
        onClick={goBack}
        style={{ width: "100%" }}
      >
        Cancel
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
          <div className="account-form-box mb-4" style={{ maxWidth: "400px" }}>
            <div className="center mb-4">
              <h3>
                <b>Password Reset</b>
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
