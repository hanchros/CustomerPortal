import React from "react";
import { Form, Input, Button } from "antd";
import { Col, Row } from "reactstrap";
import { processLink } from "../../../../utils/helper";

export const SCStep3Form = ({ onSubmit, goBack, scData }) => {
  const onFinish = (values) => {
    scData.doc_url = processLink(values.doc_url);
    scData.api_url = processLink(values.api_url);
    scData.example_url = processLink(values.example_url);
    scData.landing_url = processLink(values.landing_url);
    scData.main_service = values.main_service
    onSubmit(scData);
  };

  const onCancel = (e) => {
    e.preventDefault();
    goBack();
  };

  return (
    <Form name="register" onFinish={onFinish}>
      <div className="home-invite-form">
        <h5 className="mb-5">
          <b>Your offerings</b>
        </h5>
        <span className="form-label">Describe your service*</span>
        <Form.Item
          name="main_service"
          rules={[
            {
              required: true,
              message: "Please describe your service!",
            },
          ]}
        >
          <Input.TextArea rows={3} size="large" />
        </Form.Item>
        <span className="form-label">Documentation URL</span>
        <Form.Item name="doc_url">
          <Input size="large" placeholder="http://" />
        </Form.Item>
        <span className="form-label">API URL</span>
        <Form.Item name="api_url">
          <Input size="large" placeholder="http://" />
        </Form.Item>
        <span className="form-label">Example URL</span>
        <Form.Item name="example_url">
          <Input size="large" placeholder="http://" />
        </Form.Item>
        <span className="form-label">Landing page URL</span>
        <Form.Item name="landing_url">
          <Input size="large" placeholder="http://" />
        </Form.Item>
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

class SCStep3 extends React.Component {
  render() {
    const { goBack, onSubmit, scData } = this.props;
    return (
      <Row>
        <Col md={4}>
          <span>
            <b>STEP 4 of 4</b>
          </span>
          <div className="main-home-title mt-2 mb-4">
            Complete your company profile
          </div>
          <p className="mt-4 mb-4">
            Some information may be prefilled, but there are fields you need to
            complete.
          </p>
        </Col>
        <Col md={8}>
          <SCStep3Form onSubmit={onSubmit} goBack={goBack} scData={scData} />
        </Col>
      </Row>
    );
  }
}

export default SCStep3;
