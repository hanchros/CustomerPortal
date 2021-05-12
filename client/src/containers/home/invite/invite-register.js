import React, { useState } from "react";
import { connect } from "react-redux";
import { Form, Input, message, Button } from "antd";
import { Col, Row } from "reactstrap";
import { BigUpload } from "../../../components/template";
import { registerInvitedUser } from "../../../actions/auth";
import { ModalSpinner } from "../../../components/pages/spinner";
import history from "../../../history";
import { ErrPwdMsg } from "../../../constants";
import { checkPwdStrength } from "../../../utils/helper";
import { resolveInvite } from "../../../actions/invite";

export const InviteRegisterForm = ({
  onSubmit,
  values,
  setAvatar,
  avatarURL,
  goBack,
}) => {
  const [invalidPwd, setInvalidPwd] = useState(false);

  const onFinish = (value) => {
    if (value.password !== value.conf_password) {
      message.error("password confirmation doesn't match!");
      return;
    }
    if (!checkPwdStrength(value.password)) {
      setInvalidPwd(true);
      return;
    }
    value.photo = avatarURL;
    value.organization = value.organization || null;
    value.project_id = values.project_id;
    value.project_role = values.project_role;
    value.role = values.role;
    onSubmit(value);
  };

  const onCancel = (e) => {
    e.preventDefault();
    goBack();
  };

  return (
    <Form name="register" onFinish={onFinish} initialValues={{ ...values }}>
      <div className="home-invite-form">
        <Row className="mb-4">
          <Col md={6}>
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
            {values.organization && (
              <React.Fragment>
                <span className="form-label">Organization</span>
                <Form.Item name="organization">
                  <Input size="large" disabled />
                </Form.Item>
              </React.Fragment>
            )}
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
            <span className="form-label">Phone</span>
            <Form.Item name="phone">
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col md={6} className="pt-2 center">
            <BigUpload setAvatar={setAvatar} imageUrl={avatarURL} />
          </Col>
        </Row>
        <hr />
        <Row gutter={40} className="mt-4">
          <Col md={6}>
            <span className="form-label">Create password*</span>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input size="large" type="password" autoComplete="new-password" />
            </Form.Item>
            <span className="form-label">Confirm password*</span>
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
          </Col>
        </Row>
        {invalidPwd && <div className="pwd-error">{ErrPwdMsg}</div>}
      </div>
      <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
        <Button type="ghost" onClick={onCancel} className="ghost-btn wide">
          Cancel
        </Button>
        <Button type="ghost" htmlType="submit" className="black-btn wide ml-3">
          Continue
        </Button>
      </div>
    </Form>
  );
};

class InviteRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = { avatarURL: "", loading: false };
  }

  onSubmitRegister = async (values) => {
    const { registerInvitedUser, pdfData, resolveInvite } = this.props;
    this.setState({ loading: true });
    await registerInvitedUser(values);
    await resolveInvite(pdfData.invite, true);
    this.setState({ loading: false });
    if (pdfData.project_id) this.props.goNext();
    else history.push("/login");
  };

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  render() {
    const { pdfData, goBack } = this.props;
    return (
      <Row>
        <Col md={4}>
          <span>
            <b>STEP 2 of 3</b>
          </span>
          <div className="main-home-title mt-2 mb-4">
            Please complete your profile information
          </div>
          <p className="mt-4 mb-4">
            Some of the information was prefilled, bt there might be some fields
            you need to complete.
          </p>
        </Col>
        <Col md={8}>
          <InviteRegisterForm
            onSubmit={this.onSubmitRegister}
            values={pdfData}
            setAvatar={this.setAvatar}
            avatarURL={this.state.avatarURL}
            goBack={goBack}
          />
          <ModalSpinner visible={this.state.loading} />
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, { registerInvitedUser, resolveInvite })(
  InviteRegister
);
