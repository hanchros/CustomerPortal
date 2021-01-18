import React from "react";
import { Form, Select, Button } from "antd";
import RichTextEditor from "../../../components/pages/editor";
import { mailtemplates } from "../../../constants";

const MailForm = ({ curMail, createMail, updateMail, hideModal }) => {
  const onFinish = async (values) => {
    values.organization = curMail.organization || null;
    if (curMail._id) {
      values._id = curMail._id;
      await updateMail(values);
    } else {
      await createMail(values);
    }
    hideModal();
  };

  const hideEditForm = (e) => {
    e.preventDefault();
    hideModal();
  };

  return (
    <Form
      name="create-mail"
      className="mt-4 register-form"
      onFinish={onFinish}
      initialValues={{ ...curMail }}
    >
      <span>Name:</span>
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: `Please input the mail template name!`,
          },
        ]}
      >
        <Select placeholder="Mail name">
          {mailtemplates.map((item, index) => {
            return (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <span>Content:</span>
      <Form.Item name="content">
        <RichTextEditor placeholder="Content" />
      </Form.Item>
      <span style={{ color: "#003366" }}>
        <b>Note: </b>You shouldn't change the variable names in bracket because
        they would be exchanged with real value.
      </span>
      <div className="flex mt-4">
        <Button type="primary" htmlType="submit" className="mr-2">
          Save
        </Button>
        <Button className="mr-2" htmlType="button" onClick={hideEditForm}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default MailForm;
