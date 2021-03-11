import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import { changePassword } from "../../actions/auth";
import { Button, Form, Input, message } from "antd";
import { ErrPwdMsg } from "../../constants";
import { checkPwdStrength } from "../../utils/helper";

const ResetPasswordForm = ({ changePassword }) => {
  const [invalidPwd, setInvalidPwd] = useState(false);

  const onFinish = (values) => {
    if (values.password !== values.conf_password) {
      message.error("Confirm password doesn't match!");
      return;
    }
    if (!checkPwdStrength(values.password)) {
      setInvalidPwd(true);
      return;
    }
    changePassword(values.old_password, values.password);
  };

  return (
    <Form name="reset" className="org_register" onFinish={onFinish}>
      <div className="account-form-box">
        <Row>
          <Col md={6}>
            <span className="form-label">Old password</span>
            <Form.Item
              name="old_password"
              rules={[
                {
                  required: true,
                  message: "Please input your current password!",
                },
              ]}
            >
              <Input size="large" type="password" placeholder="**********" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <span className="form-label">New password</span>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
              ]}
            >
              <Input size="large" type="password" placeholder="************" />
            </Form.Item>
          </Col>
          <Col md={6}>
            <span className="form-label">Confirm new password</span>
            <Form.Item
              name="conf_password"
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
              ]}
            >
              <Input size="large" type="password" placeholder="************" />
            </Form.Item>
          </Col>
        </Row>
        {invalidPwd && <div className="pwd-error">{ErrPwdMsg}</div>}
      </div>
      <Button
        type="ghost"
        htmlType="submit"
        className="black-btn wide mt-5"
        style={{ float: "right" }}
      >
        Apply New Password
      </Button>
    </Form>
  );
};

class ResetPassword extends Component {
  render() {
    const { changePassword } = this.props;
    return (
      <div className="container sub-content">
        <Row>
          <Col md={4} className="mb-4">
            <h4 className="mb-4">
              <b>Change Password</b>
            </h4>
            <p>
              Before changing the password, please provide your previous
              password.
            </p>
            <p>
              The new password should be at least 8 characters in length and
              must include an upper and lower case letter, number and special
              character.
            </p>
          </Col>
          <Col md={8}>
            <ResetPasswordForm changePassword={changePassword} />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  changePassword,
})(ResetPassword);
