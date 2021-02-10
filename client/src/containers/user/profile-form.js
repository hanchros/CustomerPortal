import React from "react";
import { Form, Input, Select } from "antd";
import { Col, Row } from "reactstrap";
import Avatar from "../../components/template/upload";
import { countries } from "../../constants";
import RichTextEditor from "../../components/pages/editor";

const ProfileForm = ({ onSubmit, profile, setAvatar, avatarURL, roles }) => {
  const processLink = (link) => {
    if (!link) return "";
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      return "http://" + link;
    }
    return link;
  };

  const onFinish = (values) => {
    values.photo = avatarURL;
    values.org_name = profile.org_name;
    values.org = profile.org;
    values.org_role = profile.org_role;
    values.facebook = processLink(values.facebook);
    values.linkedin = processLink(values.linkedin);
    values.twitter = processLink(values.twitter);
    values.web = processLink(values.web);
    onSubmit(values);
  };

  return (
    <Form
      name="org_register"
      className="mt-5"
      onFinish={onFinish}
      initialValues={{ ...profile }}
    >
      <div className="avatar-uploader">
        <Avatar setAvatar={setAvatar} imageUrl={avatarURL} />
      </div>
      <div className="profile-head">
        <span>General Information</span>
      </div>
      <Row>
        <Col md={6} sm={12}>
          <Form.Item
            name="first_name"
            rules={[
              {
                required: true,
                message: "Please input the first name!",
              },
            ]}
          >
            <Input size="large" placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item
            name="last_name"
            rules={[
              {
                required: true,
                message: "Please input the last name!",
              },
            ]}
          >
            <Input size="large" placeholder="Last Name" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col md={6} sm={12}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input the email!",
              },
            ]}
          >
            <Input type="email" placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item name="address">
            <Input size="large" placeholder="Address" />
          </Form.Item>
          <Form.Item name="country">
            <Select placeholder="Country" size="large">
              {countries.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item name="phone">
            <Input placeholder="Phone" size="large" />
          </Form.Item>

          <Form.Item name="role">
            <Select placeholder="Role" size="large">
              {roles.map((item) => (
                <Select.Option key={item._id} value={item.value}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="org_name">
            <Input placeholder="Org Name" size="large" disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Item name="personal_statement">
            <RichTextEditor placeholder="Personal Statement" />
          </Form.Item>
        </Col>
      </Row>

      <div className="profile-head">
        <span>Social Information</span>
      </div>
      <Row>
        <Col md={6} sm={12}>
          <Form.Item name="twitter">
            <Input size="large" placeholder="Twitter" />
          </Form.Item>
          <Form.Item name="linkedin">
            <Input size="large" placeholder="LinkedIn" />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item name="facebook">
            <Input size="large" placeholder="Facebook" />
          </Form.Item>
          <Form.Item name="web">
            <Input size="large" placeholder="Website" />
          </Form.Item>
        </Col>
      </Row>
      <div className="profile-head mt-4">
        <span>Contact</span>
      </div>
      <Row>
        <Col>
          <Form.Item name="contact">
            <Input.TextArea
              rows={2}
              size="large"
              placeholder="Best way to contact me"
            />
          </Form.Item>
        </Col>
      </Row>

      <div className="profile-btn mt-3 mb-4">
        <button type="submit" className="main-btn">
          Save
        </button>
      </div>
    </Form>
  );
};

export default ProfileForm;
