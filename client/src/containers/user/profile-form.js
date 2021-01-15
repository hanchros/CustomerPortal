import React, { useState } from "react";
import { Form, Input, Select, AutoComplete } from "antd";
import { Col, Row } from "reactstrap";
import { CloseOutlined } from "@ant-design/icons";
import Avatar from "../../components/template/upload";
import { countries } from "../../constants";
import ListTags from "../../components/pages/tags_addons";
import RichTextEditor from "../../components/pages/editor";

const ProfileForm = ({
  onSubmit,
  profile,
  orgs,
  setAvatar,
  avatarURL,
  roles,
  fieldData,
}) => {
  const [tags, setTags] = useState(profile.tags || []);
  const [org_name, setOrgName] = useState(profile.org_name);
  const [org, setOrg] = useState(profile.org);
  const pfields = fieldData.filter((fd) => fd.field === "userform_attr");
  for (let pf of pfields) {
    profile[pf.value] = (profile.attr && profile.attr[pf.value]) || "";
  }

  const orglist = orgs.map((item) => {
    return { _id: item._id, value: item.org_name };
  });

  const deleteOrg = () => {
    setOrgName("");
    setOrg("");
  };

  const selectOrg = (value, option) => {
    setOrgName(option.value);
    setOrg(option._id);
  };

  const processLink = (link) => {
    if (!link) return "";
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      return "http://" + link;
    }
    return link;
  };

  const onFinish = (values) => {
    values.photo = avatarURL;
    values.tags = tags;
    values.org_name = org_name;
    values.org = org;
    if (!values.org_name) {
      values.org_name = values.org_input;
    }
    values.facebook = processLink(values.facebook);
    values.linkedin = processLink(values.linkedin);
    values.twitter = processLink(values.twitter);
    values.web = processLink(values.web);
    let attr = {};
    for (let pf of pfields) {
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

      <div className="profile-head">
        <span>Organization</span>
      </div>
      {!org_name && (
        <Row>
          <Col md={6} sm={12}>
            <Form.Item name="organization">
              <AutoComplete
                options={orglist}
                onSelect={selectOrg}
                size="large"
                placeholder={`Find Organization`}
                filterOption={(inputValue, option) =>
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </Form.Item>
          </Col>
          <Col md={6} sm={12}>
            <Form.Item name="org_input">
              <Input size="large" placeholder={`Enter Organization Name`} />
            </Form.Item>
          </Col>
        </Row>
      )}
      {org_name && (
        <div className="profile-orgname">
          <p>{org_name}</p>
          <div onClick={deleteOrg}>
            <CloseOutlined />
          </div>
        </div>
      )}
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

      {pfields.length > 0 && (
        <div className="profile-head">
          <span>More Attributes</span>
        </div>
      )}
      <Row>
        {pfields.map((pf) => (
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

      <ListTags
        tags={tags}
        prefix={"profile"}
        updateTags={setTags}
      />

      <div className="profile-btn">
        <button type="submit" className="hk_button">
          Save
        </button>
      </div>
    </Form>
  );
};

export default ProfileForm;
