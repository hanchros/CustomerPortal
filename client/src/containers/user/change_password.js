import React, { Component } from "react";
import { connect } from "react-redux";
import { changePassword } from "../../actions/auth";
import { Button, Form, Input, message } from "antd";

const ResetPasswordForm = ({ changePassword }) => {
  const onFinish = (values) => {
    if (values.password !== values.conf_password) {
      message.error("Confirm password doesn't match!");
      return;
    }
    changePassword(values.old_password, values.password);
  };

  return (
    <Form name="reset" className="login-form" onFinish={onFinish}>
      <Form.Item
        name="old_password"
        rules={[
          {
            required: true,
            message: "Please input your current password!",
          },
        ]}
      >
        <Input size="large" type="password" placeholder="Old Password" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your new password!",
          },
        ]}
      >
        <Input size="large" type="password" placeholder="New Password" />
      </Form.Item>
      <Form.Item
        name="conf_password"
        rules={[
          {
            required: true,
            message: "Please confirm your new password!",
          },
        ]}
      >
        <Input size="large" type="password" placeholder="Confirm Password" />
      </Form.Item>
      <div className="mt-4">
        <Button type="primary" htmlType="submit">
          Change Password
        </Button>
      </div>
    </Form>
  );
};

class ResetPassword extends Component {
  render() {
    const { changePassword } = this.props;
    return (
      <div className="container ">
        <h1 className="mt-5 center">Change Password</h1>
        <div className="flex mt-5" style={{justifyContent: "center"}}>
          <ResetPasswordForm changePassword={changePassword} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error, message: state.auth.resetMessage };
}

export default connect(mapStateToProps, {
  changePassword,
})(ResetPassword);
