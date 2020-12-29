import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Select } from "antd";
import { getForgotPasswordToken } from "../../actions/auth";
import { listQuestions, checkQuestion } from "../../actions/question";
import history from "../../history";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";

const { Option } = Select;

const ForgotForm = ({ sendMail, checkQuestion, mode, question }) => {
  const [hasQuestion, setHasQuestion] = useState(false);
  const onFinish = (values) => {
    if (hasQuestion) {
      checkQuestion(values);
    } else {
      sendMail(values.email, mode);
    }
  };

  return (
    <Form name="forgot" className="login-form" onFinish={onFinish}>
      <div className="auth-title mb-4">
        <div />
        <Link to="/">Back to Home</Link>
      </div>
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
          type="email"
          size="large"
          placeholder="Email"
        />
      </Form.Item>
      {!hasQuestion && mode === "user" && (
        <div style={{ textAlign: "left" }}>
          <span>Have you set security question?</span>
          <Button
            type="ghost"
            className="ml-2"
            onClick={() => setHasQuestion(true)}
          >
            yes
          </Button>
        </div>
      )}
      {hasQuestion && (
        <React.Fragment>
          <Form.Item
            name="question"
            rules={[
              {
                required: true,
                message: "Please input the question!",
              },
            ]}
          >
            <Select size="large" placeholder="Select your question">
              {question.questions.map((q) => (
                <Option key={q._id} value={q._id}>
                  {q.question}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="answer"
            rules={[
              {
                required: true,
                message: "Please input the answer!",
              },
            ]}
          >
            <Input size="large" type="text" placeholder="answer" />
          </Form.Item>
          <Button type="link" onClick={() => setHasQuestion(false)}>
            I haven't set security question
          </Button>
        </React.Fragment>
      )}
      <button type="submit" className="main-btn mt-5">
        Reset Password
      </button>
    </Form>
  );
};

class ForgotPassword extends Component {
  componentDidMount() {
    if (this.props.authenticated) {
      history.push("/user-dashboard");
      return;
    }
    this.props.listQuestions();
  }

  render() {
    return (
      <HomeHOC>
          <div className="main-background-title">Forgot Password</div>
          <ForgotForm
            sendMail={this.props.getForgotPasswordToken}
            checkQuestion={this.props.checkQuestion}
            mode={this.props.match.params.mode}
            question={this.props.question}
          />
      </HomeHOC>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    question: state.question,
  };
}

export default connect(mapStateToProps, {
  getForgotPasswordToken,
  listQuestions,
  checkQuestion,
})(ForgotPassword);
