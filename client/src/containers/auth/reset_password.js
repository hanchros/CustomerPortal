import React, { Component } from "react";
import { connect } from "react-redux";
import { resetPassword, resetPasswordSecurity } from "../../actions/auth";
import { Form, Input } from "antd";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";

const ResetPasswordForm = ({
  resetPassword,
  resetPasswordSecurity,
  message,
  token,
  mode,
}) => {
  const onFinish = (values) => {
    if (token && token.includes("security")) {
      let userid = token.replace("security", "");
      resetPasswordSecurity(userid, values.password, values.conf_password);
    } else {
      resetPassword(token, values.password, values.conf_password, mode);
    }
  };

  return (
    <Form name="reset" className="login-form" onFinish={onFinish}>
      <div className="auth-title mb-4">
        <div />
        <Link to="/">Back to Home</Link>
      </div>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input size="large" type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item
        name="conf_password"
        rules={[
          {
            required: true,
            message: "Please confirm your Password!",
          },
        ]}
      >
        <Input size="large" type="password" placeholder="Confirm Password" />
      </Form.Item>
      {message && <p>{message}</p>}
      <div className="reset-btn-group">
        <button type="submit" className="main-btn">
          Reset Password
        </button>
      </div>
    </Form>
  );
};

class ResetPassword extends Component {
  componentDidMount() {
    if (this.props.authenticated) {
      this.context.router.push("/");
    }
  }

  render() {
    const { resetPassword, resetPasswordSecurity, message, match } = this.props;
    return (
      <HomeHOC>
        <div className="flex-colume-center">
          <div className="main-background-title">Reset Password</div>
          <p className="mt-5" />
          <ResetPasswordForm
            resetPassword={resetPassword}
            resetPasswordSecurity={resetPasswordSecurity}
            message={message}
            token={match.params.resetToken}
            mode={match.params.mode}
          />
        </div>
      </HomeHOC>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error, message: state.auth.resetMessage };
}

export default connect(mapStateToProps, {
  resetPassword,
  resetPasswordSecurity,
})(ResetPassword);
