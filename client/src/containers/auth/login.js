import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Checkbox } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { loginUser } from "../../actions/auth";
import history from "../../history";
import HomeHOC from "../../components/template/home-hoc";

const LoginForm = ({ onSubmit }) => {
  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      name="login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input
          size="large"
          type="email"
          placeholder="Email"
        />
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
        <Input
          size="large"
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <div className="login-options">
        <Form.Item>
          <Form.Item name="remember" noStyle>
            <div className="mt-2 login-remember">
              <Checkbox>Remember me</Checkbox>
            </div>
          </Form.Item>
        </Form.Item>
        <div className="mt-2">
          <Link to="/forgot-password/user">Forgot password</Link>
        </div>
      </div>

      <div className="signup-btn mt-5">
        <button type="submit" className="main-btn">
          Log in
        </button>
        <div className="mt-5 v-center">
          <LeftOutlined />
          <Link to="/">&nbsp; RETURN TO HOME</Link>
        </div>
      </div>
    </Form>
  );
};

class Login extends Component {
  componentDidMount() {
    if (this.props.authenticated) {
      history.push("/user-dashboard");
      return;
    }
  }

  render() {
    const { loginUser } = this.props;
    return (
      <HomeHOC>
        <div className="main-background-title">LOG IN</div>
        <LoginForm onSubmit={loginUser} />
      </HomeHOC>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, { loginUser })(Login);
