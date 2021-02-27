import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import { updateProfile } from "../../actions/auth";
import { Button, Form, Checkbox } from "antd";

const NotificationForm = ({ onSubmit, profile }) => {
  const onFinish = (values) => {
    const value = Object.assign(profile, { setting: values });
    onSubmit({profile: value});
  };

  return (
    <Form
      name="reset"
      className="org_register"
      onFinish={onFinish}
      initialValues={{ ...profile.setting }}
    >
      <div className="account-form-box">
        <Row>
          <Col>
            <Form.Item name="message_notify" valuePropName="checked">
              <Checkbox>Email notifications for messages</Checkbox>
            </Form.Item>
            <Form.Item name="project_update_notify" valuePropName="checked">
              <Checkbox>Email notifications for project updates</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </div>
      <Button
        type="ghost"
        htmlType="submit"
        className="black-btn mt-5"
        style={{ float: "right" }}
      >
        save changes
      </Button>
    </Form>
  );
};

class Notifications extends Component {
  render() {
    const { updateProfile, user } = this.props;

    return (
      <div className="container sub-content">
        <Row>
          <Col md={4} className="mb-4">
            <h4 className="mb-4">
              <b>Notifications</b>
            </h4>
            <span>
              Please select which of the notifications you want to receive.
            </span>
          </Col>
          <Col md={8}>
            <NotificationForm onSubmit={updateProfile} profile={user.profile} />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
  };
}

export default connect(mapStateToProps, {
  updateProfile,
})(Notifications);
