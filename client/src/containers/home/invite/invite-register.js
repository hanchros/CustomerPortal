import React from "react";
import { connect } from "react-redux";
import { Form, Input, Col, Row, message, Select } from "antd";
import Avatar from "../../../components/template/upload";
import { getFieldData } from "../../../utils/helper";

const InviteRegisterForm = ({
  onSubmit,
  values,
  setAvatar,
  avatarURL,
  userRoles,
}) => {
  const onFinish = (values) => {
    if (values.password !== values.conf_password) {
      message.error("password confirmation doesn't match!");
      return;
    }
    values.photo = avatarURL;
    values.organization = values.organization || null
    onSubmit(values);
  };

  return (
    <Form
      name="register"
      className="register-form mt-5"
      onFinish={onFinish}
      initialValues={{ ...values }}
    >
      <p>
        Congratulations! You have just experienced blockchain “smart document”
        technology that allows ordinary documents to to processed automatically
        by almost any software.​
      </p>
      <p className="mt-5">
        Here is your information from the invitation. You may edit any fields:​
      </p>
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
        <Input size="large" placeholder="Organization Name" disabled />
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
      <p className="mt-4">Please complete your profile information:​</p>
      <Row>
        <Col md={12} sm={24}>
          <Form.Item name="phone">
            <Input size="large" placeholder="Phone" />
          </Form.Item>
          <Form.Item
            name="role"
            rules={[
              {
                required: true,
                message: "Please choose the role!",
              },
            ]}
          >
            <Select placeholder="User Role​" size="large">
              {userRoles.length > 0 &&
                userRoles.map((item, index) => {
                  return (
                    <Select.Option key={index} value={item.value}>
                      {item.value}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
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
            <Input
              size="large"
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <div className="avatar-uploader">
            <Avatar setAvatar={setAvatar} imageUrl={avatarURL} />
          </div>
        </Col>
      </Row>

      <div className="signup-btn flex mt-5">
        <button type="submit" className="main-btn">
          Next
        </button>
      </div>
    </Form>
  );
};

class InviteRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = { avatarURL: "" };
  }

  onSubmitRegister = (values) => {
    console.log(values);
    this.props.goNext();
  };

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  render() {
    const userRoles = getFieldData(this.props.fieldData, "user_role");

    return (
      <React.Fragment>
        <div className="main-background-title">REGISTRATION</div>
        <InviteRegisterForm
          onSubmit={this.onSubmitRegister}
          values={this.props.pdfData}
          setAvatar={this.setAvatar}
          avatarURL={this.state.avatarURL}
          userRoles={userRoles}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {})(InviteRegister);
