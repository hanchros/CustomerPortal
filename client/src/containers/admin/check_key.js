import React from "react";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Form, Input, message } from "antd";
import { Footer, Header } from "../../components/template";
import { keyCheck } from "../../actions/admin";

const CreateForm = ({ onSubmit }) => {
  const onFinish = async (values) => {
    onSubmit(values);
  };

  return (
    <Form name="create-gallery" onFinish={onFinish}>
      <h4 className="mt-4 mb-4">Key Check Form</h4>
      <Row>
        <Col md={12}>
          <label className="form-label">Public Key (required)</label>
          <Form.Item
            name="pubkey"
            rules={[
              {
                required: true,
                message: "Please input the public key!",
              },
            ]}
          >
            <Input.TextArea placeholder="Public Key" rows={8} spellCheck={false} />
          </Form.Item>
        </Col>
        <Col md={12}>
          <label className="form-label">Signature (required)</label>
          <Form.Item
            name="signature"
            rules={[
              {
                required: true,
                message: "Please input the signature!",
              },
            ]}
          >
            <Input.TextArea placeholder="Signature" rows={8} spellCheck={false} />
          </Form.Item>
        </Col>
        <Col md={12}>
          <label className="form-label">Text (required)</label>
          <Form.Item
            name="text"
            rules={[
              {
                required: true,
                message: "Please input the text!",
              },
            ]}
          >
            <Input placeholder="Text" />
          </Form.Item>
        </Col>
      </Row>
      <div className="flex">
        <button type="submit" className="btn-profile submit mr-2">
          Submit
        </button>
      </div>
    </Form>
  );
};

class CheckKey extends React.Component {
  onSubmitCheck = async (values) => {
    const result = await this.props.keyCheck(values);
    if (result === true) {
      message.success("Signature verified successfully!");
    } else {
      message.warning("Signature didn't pass verify");
    }
  };

  render() {
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <CreateForm onSubmit={this.onSubmitCheck} />
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
  };
};

export default connect(mapStateToProps, { keyCheck })(CheckKey);
