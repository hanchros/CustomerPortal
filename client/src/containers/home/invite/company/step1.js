import React, { useState } from "react";
import { connect } from "react-redux";
import { Form, Input, message, Button, Select } from "antd";
import { Col, Row } from "reactstrap";
import { BigUpload } from "../../../../components/template";
import {
  processLink,
  getOrgTypesData,
  checkPwdStrength,
} from "../../../../utils/helper";
import { ErrPwdMsg } from "../../../../constants";

export const SCStep1Form = ({ onSubmit, goBack, orgTypes, scData }) => {
  const [avatarURL, setAvatar] = useState("");
  const [invalidPwd, setInvalidPwd] = useState(false);

  const onFinish = (values) => {
    if (values.password !== values.conf_password) {
      message.error("password confirmation doesn't match!");
      return;
    }
    if (!checkPwdStrength(values.password)) {
      setInvalidPwd(true);
      return;
    }
    values.logo = avatarURL;
    values.website = processLink(values.website);
    onSubmit(values);
  };

  const onCancel = (e) => {
    e.preventDefault();
    goBack();
  };

  return (
    <Form name="register" onFinish={onFinish} initialValues={{ ...scData }}>
      <div className="sc-invite-form">
        <div className="form-box">
          <h5 className="mb-5">
            <b>Software company profile</b>
          </h5>
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
              <span className="form-label">Organization phone*</span>
              <Form.Item
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input the organization phone!",
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
              <span className="form-label">Organization email*</span>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input the organization email!",
                  },
                ]}
              >
                <Input size="large" type="email" />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className="form-box">
          <Row>
            <Col md={6}>
              <span className="form-label">Contact</span>
              <Form.Item
                name="contact"
                rules={[
                  {
                    required: true,
                    message: "Please input the contact name!",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col md={6}>
              <span className="form-label">Website</span>
              <Form.Item name="website">
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <span className="form-label">Address</span>
              <Form.Item name="address">
                <Input size="large" />
              </Form.Item>
              <span className="form-label">Detailed description</span>
              <Form.Item name="description">
                <Input.TextArea size="large" rows={3} />
              </Form.Item>
              <div className="flex" style={{ justifyContent: "center" }}>
                <BigUpload setAvatar={setAvatar} imageUrl={avatarURL} />
              </div>
            </Col>
          </Row>
        </div>
        <div className="form-box">
          <Row>
            <Col md={6}>
              <span className="form-label">
                Create company account password
              </span>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input the password!",
                  },
                ]}
              >
                <Input size="large" type="password" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <span className="form-label">Confirm password</span>
              <Form.Item
                name="conf_password"
                rules={[
                  {
                    required: true,
                    message: "Please input the confirmation password!",
                  },
                ]}
              >
                <Input size="large" type="password" />
              </Form.Item>
            </Col>
          </Row>
          {invalidPwd && <div className="pwd-error">{ErrPwdMsg}</div>}
        </div>
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

class SCStep1 extends React.Component {
  render() {
    const { goBack, onSubmit, fieldData, scData } = this.props;
    const orgTypes = getOrgTypesData(fieldData);
    return (
      <Row>
        <Col md={4}>
          <span>
            <b>STEP 2 of 4</b>
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
          <SCStep1Form
            onSubmit={onSubmit}
            goBack={goBack}
            orgTypes={orgTypes}
            scData={scData}
          />
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {})(SCStep1);
