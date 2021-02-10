import React from "react";
import { Form, Input } from "antd";

export const OrgInviteForm = ({ onSubmit, project }) => {
  const onFinish = (values) => {
    values.project_name = project.name;
    values.project_id = project._id;
    values.intro = window.btoa(values.intro || "");
    onSubmit(values);
  };
  return (
    <Form name="invite" className="register-form" onFinish={onFinish}>
      <span>Organization name:</span>
      <Form.Item
        name="organization"
        rules={[
          {
            required: true,
            message: "Please input the organization!",
          },
        ]}
      >
        <Input size="large" placeholder="Organization" />
      </Form.Item>
      <span>Leader:</span>
      <Form.Item
        name="first_name"
        rules={[
          {
            required: true,
            message: "Please input first name!",
          },
        ]}
      >
        <Input size="large" placeholder="First Name" />
      </Form.Item>
      <Form.Item
        name="last_name"
        rules={[
          {
            required: true,
            message: "Please input last name!",
          },
        ]}
      >
        <Input size="large" placeholder="Last Name" />
      </Form.Item>
      <span>E-mail:</span>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input size="large" type="email" placeholder="E-mail" />
      </Form.Item>
      <span>Introduction:</span>
      <Form.Item name="intro">
        <Input.TextArea rows={3} size="large" placeholder="Introduction" />
      </Form.Item>
      <div className="signup-btn mt-4">
        <button type="submit" className="main-btn template-btn">
          Invite
        </button>
      </div>
    </Form>
  );
};

export const TeamInviteForm = ({ onSubmit, project, org }) => {
  const onFinish = (values) => {
    values.project_name = project.name;
    values.project_id = project._id;
    values.organization = org.org_name;
    values.intro = window.btoa(values.intro || "");
    onSubmit(values);
  };
  return (
    <Form name="invite" className="register-form" onFinish={onFinish}>
      <span>Name:</span>
      <Form.Item
        name="first_name"
        rules={[
          {
            required: true,
            message: "Please input first name!",
          },
        ]}
      >
        <Input size="large" placeholder="First Name" />
      </Form.Item>
      <Form.Item
        name="last_name"
        rules={[
          {
            required: true,
            message: "Please input last name!",
          },
        ]}
      >
        <Input size="large" placeholder="Last Name" />
      </Form.Item>
      <span>Role:</span>
      <Form.Item name="project_role">
        <Input size="large" placeholder="Role" />
      </Form.Item>
      <span>E-mail:</span>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input size="large" type="email" placeholder="E-mail" />
      </Form.Item>
      <div className="signup-btn mt-4">
        <button type="submit" className="main-btn template-btn">
          Invite
        </button>
      </div>
    </Form>
  );
};
