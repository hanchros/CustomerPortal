import React, { useState } from "react";
import { Form, Input, Select, message } from "antd";
import { Col, Row } from "reactstrap";
import Avatar from "../../components/template/upload";
import { countries } from "../../constants/countries";
import Tags from "../../components/pages/tags_addons";
import RichTextEditor from "../../components/pages/editor";

const OrgEditForm = ({
  onSubmit,
  orgTypes,
  setAvatar,
  avatarURL,
  org,
  fieldData,
  label,
}) => {
  const [tags, setTags] = useState(org.tags || []);
  const ofields = fieldData.filter((fd) => fd.field === "orgform_attr");
  for (let pf of ofields) {
    org[pf.value] = (org.attr && org.attr[pf.value]) || "";
  }
  
  const onFinish = (values) => {
    console.log(values)
    if (!avatarURL) {
      message.error("Please upload logo image");
      return;
    }
    values._id = org._id;
    values.logo = avatarURL;
    values.tags = tags;
    let attr = {};
    for (let pf of ofields) {
      attr[pf.value] = values[pf.value] || "";
      delete values[pf.value];
    }
    values.attr = attr;
    onSubmit(values);
  };

  return (
    <Form
      name="org_register"
      className="mt-5"
      onFinish={onFinish}
      initialValues={{ ...org }}
    >
      <div className="avatar-uploader">
        <Avatar setAvatar={setAvatar} imageUrl={avatarURL} />
      </div>
      <div className="divid-head">
        <span>General Information</span>
      </div>
      <hr />
      <Row>
        <Col md={6} sm={12}>
          <Form.Item
            name="org_name"
            rules={[
              {
                required: true,
                message: "Please input the name!",
              },
            ]}
          >
            <Input size="large" placeholder="Name" />
          </Form.Item>
          <Form.Item name="website">
            <Input size="large" placeholder="Website" />
          </Form.Item>
          <Form.Item
            name="address"
            rules={[
              {
                required: true,
                message: "Please input the address!",
              },
            ]}
          >
            <Input size="large" placeholder="Address" />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item
            name="org_type"
            rules={[
              {
                required: true,
                message: "Please choose the type!",
              },
            ]}
          >
            <Select placeholder="Type" size="large">
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
          <Form.Item name="country">
            <Select placeholder="Country" size="large">
              {countries.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div className="register-city">
            <Form.Item name="city">
              <Input placeholder="City" size="large" />
            </Form.Item>
            <Form.Item name="state">
              <Input placeholder="State" size="large" />
            </Form.Item>
          </div>
        </Col>
      </Row>
      <div className="divid-head">
        <span>
          {label.titleOrganization} Liaison to the Hackathon Dev{" "}
          {label.titleChallenge}
        </span>
      </div>
      <hr />
      <Row>
        <Col md={6} sm={12}>
          <Form.Item name="contact_name">
            <Input size="large" placeholder="Contact Name" />
          </Form.Item>
          <Form.Item name="contact_phone">
            <Input size="large" placeholder="Contact Phone" />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item
            name="contact_email"
            rules={[
              {
                type: "email",
                message: "The input is not valid Email!",
              },
              {
                required: true,
                message: "Please input the contact Email!",
              },
            ]}
          >
            <Input size="large" type="email" placeholder="Contact Email" />
          </Form.Item>
        </Col>
      </Row>
      <div className="divid-head">
        <span>Authorized Representative</span>
      </div>
      <hr />
      <Row>
        <Col md={6} sm={12}>
          <Form.Item name="authorized_name">
            <Input size="large" placeholder="Authorized Name" />
          </Form.Item>
          <Form.Item
            name="authorized_email"
            rules={[
              {
                type: "email",
                message: "The input is not valid Email!",
              },
              {
                required: true,
                message: "Please input the authorized Email!",
              },
            ]}
          >
            <Input size="large" placeholder="Authorized Email" />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item name="authorized_title">
            <Input size="large" placeholder="Authorized Title" />
          </Form.Item>
          <Form.Item name="authorized_phone">
            <Input size="large" placeholder="Authorized Phone" />
          </Form.Item>
        </Col>
      </Row>

      {ofields.length > 0 && (
        <div className="profile-head">
          <span>More Attributes</span>
        </div>
      )}
      <Row>
        {ofields.map((pf) => (
          <Col key={pf._id} md={pf.option === "richtext" ? 12 : 6} sm={12}>
            <Form.Item name={pf.value}>
              {pf.option !== "richtext" ? (
                <Input size="large" placeholder={pf.value} />
              ) : (
                <RichTextEditor placeholder={pf.value} />
              )}
            </Form.Item>
          </Col>
        ))}
      </Row>

      <Tags
        fieldData={fieldData}
        tags={tags}
        updateTags={setTags}
        prefix={"organization"}
      />

      <div className="signup-btn">
        <button type="submit" className="hk_button">
          Save
        </button>
      </div>
    </Form>
  );
};

export default OrgEditForm;
