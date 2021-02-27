import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { resetPassword, resetPasswordSecurity } from "../../actions/auth";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";
import { ErrPwdMsg } from "../../constants";
import { checkPwdStrength } from "../../utils/helper";

const ResetPasswordForm = ({
  resetPassword,
  resetPasswordSecurity,
  token,
  mode,
}) => {
  const [invalidPwd, setInvalidPwd] = useState(false);

  const onFinish = (values) => {
    if (!checkPwdStrength(values.password)) {
      setInvalidPwd(true);
      return;
    }
    setInvalidPwd(false);
    if (token && token.includes("security")) {
      let userid = token.replace("security", "");
      resetPasswordSecurity(userid, values.password, values.conf_password);
    } else {
      resetPassword(token, values.password, values.conf_password, mode);
    }
  };

  return (
    <Form name="reset" className="login-form" onFinish={onFinish}>
      <div className="account-form-box">
        <div className="main-background-title mb-5">Reset Password</div>
        <div className="flex mb-2" style={{ justifyContent: "flex-end" }}>
          <Link to="/">Back to Home</Link>
        </div>
        <span className="form-label">New password</span>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input size="large" type="password" />
        </Form.Item>
        <span className="form-label">Confirm password</span>
        <Form.Item
          name="conf_password"
          rules={[
            {
              required: true,
              message: "Please confirm your Password!",
            },
          ]}
        >
          <Input size="large" type="password" />
        </Form.Item>
        {invalidPwd && <div className="pwd-error">{ErrPwdMsg}</div>}
        <Button
          type="ghost"
          htmlType="submit"
          className="black-btn mt-5"
          style={{ width: "100%" }}
        >
          Reset Password
        </Button>
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
    const { resetPassword, resetPasswordSecurity, match } = this.props;
    return (
      <HomeHOC>
        <div className="flex-colume-center">
          <ResetPasswordForm
            resetPassword={resetPassword}
            resetPasswordSecurity={resetPasswordSecurity}
            token={match.params.resetToken}
            mode={match.params.mode}
          />
        </div>
      </HomeHOC>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  resetPassword,
  resetPasswordSecurity,
})(ResetPassword);
