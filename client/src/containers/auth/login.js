import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Checkbox, Button } from "antd";
import { Link } from "react-router-dom";
import { loginUser } from "../../actions/auth";
import history from "../../history";
import HomeHOC from "../../components/template/home-hoc";
import RequestInvite from "../home/invite/request-invite";

const LoginForm = ({ onSubmit, onGoRI }) => {
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
        <Input size="large" type="email" />
      </Form.Item>
      <span className="form-label">Password</span>
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
      <Link to="/forgot-password/user" className="underline-link">
        Forgot password?
      </Link>
      <div className="login-options">
        <Form.Item>
          <Form.Item name="remember" noStyle>
            <div className="mt-4 login-remember">
              <Checkbox>Remember me on this computer</Checkbox>
            </div>
          </Form.Item>
        </Form.Item>
      </div>

      <div className="center mt-4">
        <Button
          htmlType="submit"
          className="black-btn wide"
          style={{ width: "100%" }}
        >
          Sign me in
        </Button>
        <div className="mt-5 center">
          <div>Don't have an account?</div>
          <Link to="#" onClick={onGoRI} className="underline-link">
            Request an access
          </Link>
        </div>
      </div>
    </Form>
  );
};

class Login extends Component {
  constructor() {
    super();
    this.state = {
      showRI: false,
    };
  }

  onToggleRI = () => {
    this.setState({ showRI: !this.state.showRI });
  };

  componentDidMount() {
    if (this.props.authenticated) {
      history.push(`/dashboard`);
      return;
    }
  }

  render() {
    const { loginUser } = this.props;
    const { showRI } = this.state;

    return (
      <HomeHOC>
        {showRI && <RequestInvite goNext={this.onToggleRI} />}
        {!showRI && (
          <div className="flex-colume-center">
            <div className="account-form-box mb-4">
              <div className="center mb-4">
                <h3>
                  <b>Sign in</b>
                </h3>
              </div>
              <LoginForm onSubmit={loginUser} onGoRI={this.onToggleRI} />
            </div>
          </div>
        )}
      </HomeHOC>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    curOrg: state.organization.currentOrganization,
  };
}

export default connect(mapStateToProps, { loginUser })(Login);
