import React from "react";
import { connect } from "react-redux";
import { Drawer, Form, Select, Button, Input, message } from "antd";
import { Col, Row } from "reactstrap";
import { createQuestion, updateQuestion } from "../../actions/question";

const { Option } = Select;

const SecurityForm = ({
  createQuestion,
  updateQuestion,
  question,
  questions,
  onClose,
}) => {
  const onFinish = (values) => {
    if (
      values.question1 === values.question2 ||
      values.question1 === values.question3 ||
      values.question2 === values.question3
    ) {
      message.error("There is same security questions");
      return;
    }
    let qarray = [];
    qarray.push({
      question: values.question1,
      answer: values.answer1,
    });
    qarray.push({
      question: values.question2,
      answer: values.answer2,
    });
    qarray.push({
      question: values.question3,
      answer: values.answer3,
    });

    if (!question._id) {
      createQuestion(qarray);
    } else {
      updateQuestion(qarray, question._id);
    }
    onClose();
  };

  let iniVal = {};
  if (question.questions && question.questions.length === 3) {
    iniVal = {
      question1: question.questions[0].question,
      answer1: question.questions[0].answer,
      question2: question.questions[1].question,
      answer2: question.questions[1].answer,
      question3: question.questions[2].question,
      answer3: question.questions[2].answer,
    };
  }

  return (
    <Form
      name="security-question-form"
      className="mt-4"
      onFinish={onFinish}
      initialValues={{ ...iniVal }}
    >
      <Row className="mt-5">
        <Col>
          <Form.Item
            name="question1"
            rules={[
              {
                required: true,
                message: "Please input the question!",
              },
            ]}
          >
            <Select placeholder="Security Question 1">
              {questions.map((q) => (
                <Option key={q._id} value={q._id}>
                  {q.question}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            className="mb-5"
            name="answer1"
            rules={[
              {
                required: true,
                message: "Please input the answer!",
              },
            ]}
          >
            <Input.Password type="text" placeholder="answer" />
          </Form.Item>

          <Form.Item
            name="question2"
            rules={[
              {
                required: true,
                message: "Please input the question!",
              },
            ]}
          >
            <Select placeholder="Security Question 2">
              {questions.map((q) => (
                <Option key={q._id} value={q._id}>
                  {q.question}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            className="mb-5"
            name="answer2"
            rules={[
              {
                required: true,
                message: "Please input the answer!",
              },
            ]}
          >
            <Input.Password type="text" placeholder="answer" />
          </Form.Item>

          <Form.Item
            name="question3"
            rules={[
              {
                required: true,
                message: "Please input the question!",
              },
            ]}
          >
            <Select placeholder="Security Question 3">
              {questions.map((q) => (
                <Option key={q._id} value={q._id}>
                  {q.question}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="answer3"
            rules={[
              {
                required: true,
                message: "Please input the answer!",
              },
            ]}
          >
            <Input.Password type="text" placeholder="answer" />
          </Form.Item>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col className="flex" style={{ justifyContent: "center" }}>
          <Button className="mr-3" onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

class SecurityQuestion extends React.Component {
  render = () => {
    const {
      visible,
      onCloseDrawer,
      createQuestion,
      updateQuestion,
      question,
    } = this.props;
    return (
      <Drawer
        title="Security Question"
        placement="right"
        closable={false}
        onClose={onCloseDrawer}
        visible={visible}
        width={600}
      >
        <SecurityForm
          createQuestion={createQuestion}
          updateQuestion={updateQuestion}
          question={question.securityquestion}
          questions={question.questions}
          onClose={onCloseDrawer}
        />
      </Drawer>
    );
  };
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    question: state.question,
  };
}

export default connect(mapStateToProps, {
  createQuestion,
  updateQuestion,
})(SecurityQuestion);
