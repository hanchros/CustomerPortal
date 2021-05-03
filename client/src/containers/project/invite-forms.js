import React, { useState } from "react";
import { Form, Input, Select, Button } from "antd";
import { FileAddOutlined } from "@ant-design/icons";

export const OrgInviteForm = ({ onSubmit, project, onDownload }) => {
  const [download, setDownload] = useState(false);
  const onFinish = (values) => {
    values.project_name = project.name;
    values.project_id = project._id;
    values.intro = "";
    if (download) onDownload(values);
    else onSubmit(values);
  };

  const onDownloadClick = (e) => {
    setDownload(true);
  };

  const onSendClick = (e) => {
    setDownload(false);
  };

  return (
    <Form name="inviteOrg" className="register-form" onFinish={onFinish}>
      <span className="form-label">Organization name*</span>
      <Form.Item
        name="organization"
        rules={[
          {
            required: true,
            message: "Please input the organization!",
          },
        ]}
      >
        <Input size="large" autoFocus={true} />
      </Form.Item>
      <span className="form-label">Person’s corporate email*</span>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input size="large" type="email" />
      </Form.Item>
      <span className="form-label">First name*</span>
      <Form.Item
        name="first_name"
        rules={[
          {
            required: true,
            message: "Please input first name!",
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>
      <span className="form-label">Last name*</span>
      <Form.Item
        name="last_name"
        rules={[
          {
            required: true,
            message: "Please input last name!",
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>
      <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
        <Button
          type="ghost"
          htmlType="submit"
          className="ghost-btn"
          onClick={onDownloadClick}
        >
          <FileAddOutlined />
          generate invitation
        </Button>
        <Button
          type="ghost"
          htmlType="submit"
          className="black-btn ml-3"
          onClick={onSendClick}
        >
          Send Invite
        </Button>
      </div>
    </Form>
  );
};

export const TeamInviteForm = ({
  onSubmit,
  project,
  org,
  roles,
  onDownload,
}) => {
  const [download, setDownload] = useState(false);
  const onFinish = (values) => {
    values.project_name = project.name;
    values.project_id = project._id;
    values.organization = org.org_name;
    values.intro = window.btoa(values.intro || "");
    if (download) onDownload(values);
    else onSubmit(values);
  };

  const onDownloadClick = (e) => {
    setDownload(true);
  };

  const onSendClick = (e) => {
    setDownload(false);
  };

  return (
    <Form name="inviteTeam" className="register-form" onFinish={onFinish}>
      <span className="form-label">Person's corporate email*</span>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input size="large" type="email" />
      </Form.Item>
      <span className="form-label">First name*</span>
      <Form.Item
        name="first_name"
        rules={[
          {
            required: true,
            message: "Please input first name!",
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>
      <span className="form-label">Last name*</span>
      <Form.Item
        name="last_name"
        rules={[
          {
            required: true,
            message: "Please input last name!",
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>

      <span className="form-label">Role in {org.org_name}*</span>
      <Form.Item
        name="project_role"
        rules={[
          {
            required: true,
            message: "Please select the role!",
          },
        ]}
      >
        <Select placeholder="Role" size="large">
          {roles.map((item) => (
            <Select.Option key={item._id} value={item.value}>
              {item.value}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
        <Button
          type="ghost"
          htmlType="submit"
          className="ghost-btn"
          onClick={onDownloadClick}
        >
          <FileAddOutlined />
          generate invitation
        </Button>
        <Button
          type="ghost"
          htmlType="submit"
          className="black-btn ml-3"
          onClick={onSendClick}
        >
          Send Invite
        </Button>
      </div>
    </Form>
  );
};
