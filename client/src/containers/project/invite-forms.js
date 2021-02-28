import React from "react";
import { Form, Input, Select, Button } from "antd";

export const OrgInviteForm = ({ onSubmit, project }) => {
  const onFinish = (values) => {
    values.project_name = project.name;
    values.project_id = project._id;
    values.intro = "";
    onSubmit(values);
  };

  return (
    <Form name="inviteOrg" className="register-form" onFinish={onFinish}>
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
        <Input size="large" />
      </Form.Item>
      <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
        <Button type="ghost" htmlType="submit" className="black-btn ml-3">
          Send Invite
        </Button>
      </div>
    </Form>
  );
};

export const TeamInviteForm = ({ onSubmit, project, org, roles }) => {
  const onFinish = (values) => {
    values.project_name = project.name;
    values.project_id = project._id;
    values.organization = org.org_name;
    values.intro = window.btoa(values.intro || "");
    onSubmit(values);
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
        <Button type="ghost" htmlType="submit" className="black-btn ml-3">
          Send Invite
        </Button>
      </div>
    </Form>
  );
};
