import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, message } from "antd";
import { Col, Row } from "reactstrap";
import { LeftOutlined } from "@ant-design/icons";
import { registerUser } from "../../actions/auth";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";

const SignupForm = ({ onSubmit }) => {
  const onFinish = (values) => {
    if (values.password !== values.conf_password) {
      message.error("password confirmation doesn't match!");
      return;
    }
    delete values.conf_password;
    onSubmit(values);
  };

  return (
    <Form name="register" className="register-form mt-5" onFinish={onFinish}>
      <Row>
        <Col md={6}>
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
        </Col>
        <Col md={6}>
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
        </Col>
      </Row>
      <Row>
        <Col md={6}>
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
        </Col>
      </Row>
      <Row>
        <Col md={6}>
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
        </Col>
        <Col md={6}>
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
      </Row>
      <div className="signup-btn mt-5">
        <button type="submit" className="main-btn">
          Register
        </button>
        <div className="mt-5 v-center">
          <LeftOutlined />
          <Link to="/">&nbsp; RETURN TO HOME</Link>
        </div>
      </div>
    </Form>
  );
};

class Register extends Component {
  onSubmit = (values) => {
    const { registerUser } = this.props;
    registerUser(values);
  };

  render() {
    return (
      <HomeHOC>
        <div className="flex-colume-center">
          <div className="main-background-title">REGISTRATION</div>
          <SignupForm onSubmit={this.onSubmit} />
        </div>
      </HomeHOC>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { registerUser })(Register);
