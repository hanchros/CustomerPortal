import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { Button, Form, Input, Select, Checkbox } from "antd";
import { connect } from "react-redux";
import ColorPicker from "rc-color-picker";
import {
  updateOrganization,
  testColorChange,
} from "../../../actions/organization";
import { processLink, getOrgTypesData } from "../../../utils/helper";
import { BigUpload } from "../../../components/template";
import { org_consts } from "../../../constants";

const OrgAdminForm = ({ onUpdateOrg, org, orgTypes, testColorChange }) => {
  const [avatarURL, setAvatar] = useState(org.logo || "");
  const [profile, setProfile] = useState(org.profile || org_consts);

  const onFinish = async (values) => {
    values._id = org._id || null;
    values.logo = avatarURL;
    values.social = processLink(values.social);
    values.linkedin = processLink(values.linkedin);
    values.profile = profile;
    values.org_name = values.org_name.trim();
    await onUpdateOrg(values);
  };

  const onChangeProfile = (name, value) => {
    profile[name] = value;
    testColorChange(profile, org.org_name);
    setProfile(profile);
  };

  // const onChangeDefaultColor = () => {
  //   testColorChange(org_consts, org.org_name);
  //   setProfile(org_consts);
  // };

  return (
    <Form
      name="org_register"
      className="org-form"
      onFinish={onFinish}
      initialValues={{ ...org }}
    >
      <Row>
        <Col md={4} className="mb-4">
          <h4 className="mb-4">
            <b>{org.org_name}</b>
          </h4>
          <BigUpload
            setAvatar={setAvatar}
            imageUrl={avatarURL}
            subject="organization"
          />
        </Col>
        <Col md={8}>
          <div className="account-form-box">
            <Row>
              <Col md={6}>
                <span className="form-label">Organization name*</span>
                <Form.Item
                  name="org_name"
                  rules={[
                    {
                      required: true,
                      message: "Please input the organization name!",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col md={6}>
                <span className="form-label">Organization type*</span>
                <Form.Item
                  name="org_type"
                  rules={[
                    {
                      required: true,
                      message: "Please choose the type!",
                    },
                  ]}
                >
                  <Select size="large">
                    {orgTypes.length > 0 &&
                      orgTypes.map((item, index) => {
                        return (
                          <Select.Option key={index} value={item.value}>
                            {item.value}
                            {item.value === "Other" ? "..." : ""}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <span className="form-label">Headquarters location</span>
                <Form.Item
                  name="location"
                  rules={[
                    {
                      required: true,
                      message: "Please input the headquarters location!",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <span className="form-label">Website*</span>
                <Form.Item
                  name="social"
                  rules={[
                    {
                      required: true,
                      message: "Please input the organization social media!",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col md={6}>
                <span className="form-label">Linkedin</span>
                <Form.Item name="linkedin">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <p className="mt-3">
              <b>Bio</b>
            </p>
            <Row>
              <Col>
                <Form.Item name="bio">
                  <Input.TextArea rows={5} size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="account-form-box mt-5">
            <Row>
              <Col md={4}>
                <div className="color-picker-box">
                  <ColorPicker
                    color={profile.primary_color}
                    alpha={100}
                    onClose={(colors) =>
                      onChangeProfile("primary_color", colors.color)
                    }
                    placement="topLeft"
                    className="some-class"
                  >
                    <span className="rc-color-picker-trigger" />
                  </ColorPicker>
                  <span>
                    <b>Accent Color</b>
                  </span>
                </div>
              </Col>
              <Col md={8}>
                <Checkbox className="pt-3" defaultChecked>
                  Use dark text color on top of the accent color
                </Checkbox>
              </Col>
            </Row>
          </div>
          <Button
            type="ghost"
            htmlType="submit"
            className="black-btn wide mt-5"
            style={{ float: "right" }}
          >
            Save changes
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

class OrgBasics extends React.Component {
  render() {
    const {
      organization,
      updateOrganization,
      testColorChange,
      fieldData,
    } = this.props;
    const org = organization.currentOrganization;
    const orgTypes = getOrgTypesData(fieldData);

    return (
      <OrgAdminForm
        onUpdateOrg={updateOrganization}
        org={org}
        orgTypes={orgTypes}
        testColorChange={testColorChange}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    organization: state.organization,
    fieldData: state.profile.fieldData,
  };
};

export default connect(mapStateToProps, {
  updateOrganization,
  testColorChange,
})(OrgBasics);
