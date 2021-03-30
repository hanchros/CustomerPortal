import React, { useState } from "react";
import { Button, Form, Input, Select, Collapse, Checkbox } from "antd";
import { PlusSquareFilled, MinusSquareFilled } from "@ant-design/icons";
import { Col, Row } from "reactstrap";
import { BigUpload } from "../../components/template";
import { processLink } from "../../utils/helper";
import { company_services } from "../../constants";

const { Panel } = Collapse;

const ProfileForm = ({ onSubmit, profile, orgTypes }) => {
  const [avatarURL, setAvatar] = useState(profile.logo);
  const [services, setServices] = useState(profile.services || []);
  const [activeKeys, setActiveKeys] = useState([]);

  const onFinish = (values) => {
    values.logo = avatarURL;
    values.website = processLink(values.website);
    values.services = services;
    onSubmit(values);
  };

  const onChangeCheck = (cs, item) => {
    let svs = [...services];
    for (let i = 0; i < svs.length; i++) {
      if (svs[i].title === cs.title) {
        const index = svs[i].items.indexOf(item);
        if (index === -1) svs[i].items.push(item);
        else svs[i].items.splice(index, 1);
      }
    }
    setServices(svs);
  };

  const checkItems = (cs, item) => {
    for (let sv of services) {
      if (sv.title === cs.title) {
        const index = sv.items.indexOf(item);
        return index !== -1;
      }
    }
    return false;
  };

  const genExtra = (cs) => {
    for (let sv of services) {
      if (sv.title === cs.title && sv.items.length > 0) {
        return <span className="sc-services">{sv.items.length}</span>;
      }
    }
    return null;
  };

  return (
    <Form
      name="org_register"
      onFinish={onFinish}
      initialValues={{ ...profile }}
    >
      <Row>
        <Col md={4} className="mb-4">
          <h4 className="mb-4">
            <b>{profile.org_name}</b>
          </h4>
          <BigUpload
            setAvatar={setAvatar}
            imageUrl={avatarURL}
            subject="company"
          />
        </Col>
        <Col md={8}>
          <div className="sc-invite-form">
            <div className="form-box">
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
                </Col>
              </Row>
            </div>
          </div>
          <div className="home-invite-form company-invite mt-4">
            <h5 className="mb-5">
              <b>What type of software do you provide?</b>
            </h5>
            <p className="mb-5">
              Please check the boxes for the categories of software that your
              organization provides.
            </p>
            <Collapse onChange={setActiveKeys}>
              {company_services.map((cs) => (
                <Panel
                  header={
                    <span className="flex" style={{ alignItems: "center" }}>
                      {activeKeys.indexOf(cs.title) === -1 && (
                        <PlusSquareFilled />
                      )}
                      {activeKeys.indexOf(cs.title) !== -1 && (
                        <MinusSquareFilled />
                      )}
                      {cs.title}
                    </span>
                  }
                  key={cs.title}
                  extra={genExtra(cs)}
                  showArrow={false}
                >
                  {cs.items.map((item) => (
                    <p className="cs-checker" key={item}>
                      <Checkbox
                        onChange={() => onChangeCheck(cs, item)}
                        checked={checkItems(cs, item)}
                      >
                        {item}
                      </Checkbox>
                    </p>
                  ))}
                </Panel>
              ))}
            </Collapse>
          </div>
          <Button
            type="ghost"
            htmlType="submit"
            className="black-btn mt-4"
            style={{ float: "right" }}
          >
            Save Changes
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ProfileForm;
