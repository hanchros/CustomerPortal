import React from "react";
import { Form, Input, Select, Button } from "antd";
import { Col, Row } from "reactstrap";
import { BigUpload } from "../../components/template";
import IconLinkedin from "../../assets/icon/linkedin.png";
import IconFacebook from "../../assets/icon/facebook.png";
import IconTwitter from "../../assets/icon/twitter.png";
import IconWeb from "../../assets/icon/challenge.png";
import { processLink } from "../../utils/helper";

const OrgEditForm = ({
  onSubmit,
  onCancel,
  orgTypes,
  setAvatar,
  avatarURL,
  org,
  userId,
}) => {
  const onFinish = (values) => {
    values._id = org._id || null;
    values.logo = avatarURL || "";
    values.creator = org.creator || userId || null;
    values.profile = org.profile || {};
    values.social = processLink(values.social);
    onSubmit(values);
  };

  return (
    <Form
      name="org_register"
      className="mt-5"
      onFinish={onFinish}
      initialValues={{ ...org }}
    >
      <Row className="mb-4">
        <Col sm={6}>
          <Input size="large" disabled placeholder="Upload Logo" />
        </Col>
        <Col sm={6} className="center">
          <BigUpload setAvatar={setAvatar} imageUrl={avatarURL} />
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Item
            name="org_name"
            rules={[
              {
                required: true,
                message: "Please input the organization name!",
              },
            ]}
          >
            <Input placeholder="Organization Name" size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Item
            name="org_type"
            rules={[
              {
                required: true,
                message: "Please choose the type!",
              },
            ]}
          >
            <Select placeholder="Organization type​" size="large">
              {orgTypes.length > 0 &&
                orgTypes.map((item, index) => {
                  return (
                    <Select.Option key={index} value={item.value}>
                      {item.value}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Item
            name="location"
            rules={[
              {
                required: true,
                message: "Please input the organization location!",
              },
            ]}
          >
            <Input placeholder="Headquarters location" size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Item
            name="social"
            rules={[
              {
                required: true,
                message: "Please input the organization social media!",
              },
            ]}
          >
            <Input placeholder="Add social media" size="large" />
          </Form.Item>
        </Col>
        <Col sm={6}>
          <div className="org-social-input center">
            <img src={IconLinkedin} alt="" />
            <img src={IconTwitter} alt="" />
            <img src={IconFacebook} alt="" />
            <img src={IconWeb} alt="" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Form.Item name="bio">
            <Input.TextArea rows={5} size="large" placeholder="Bio" />
          </Form.Item>
        </Col>
      </Row>
      <div className="signup-btn">
        <Button type="primary" className="mr-3" htmlType="submit">
          Submit
        </Button>
        <Button
          type="default"
          onClick={(e) => {
            e.preventDefault();
            onCancel();
          }}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default OrgEditForm;
