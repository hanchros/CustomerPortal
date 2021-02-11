import React, { useState } from "react";
import { Form, Input, Button, Popconfirm } from "antd";
import Technology from "../../template/technology";

const TemplateForm = ({
  curTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  hideModal,
  setTemplate,
}) => {
  const [technologies, setTechnologies] = useState(
    curTemplate.technologies || []
  );

  const onFinish = async (values) => {
    values.technologies = technologies.map((tech) => {
      return tech._id;
    });
    if (curTemplate._id) {
      values._id = curTemplate._id;
      let newTemp = await updateTemplate(values);
      setTemplate(newTemp);
    } else {
      await createTemplate(values);
    }
    hideModal();
  };

  const hideEditForm = (e) => {
    e.preventDefault();
    hideModal();
  };

  const onDeleteTemplate = async (e) => {
    e.preventDefault();
    await deleteTemplate(curTemplate._id);
    hideModal();
  };

  return (
    <Form
      name="create-template"
      className="mt-4 register-form"
      onFinish={onFinish}
      initialValues={{ ...curTemplate }}
    >
      <span>Name:</span>
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: `Please input the template name!`,
          },
        ]}
      >
        <Input type="text" className="name" />
      </Form.Item>

      <span>Objective:</span>
      <Form.Item name="objective">
        <Input />
      </Form.Item>
      <p>What are you automating? Contracts, invoices, etc</p>
      <p className="mb-4"></p>
      <span>Description:</span>
      <Form.Item name="description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <p className="mb-4"></p>
      <span>Technology:</span>
      <Technology technologies={technologies} onChangeTechs={setTechnologies} />
      <div className="flex mt-4">
        <Button type="primary" htmlType="submit" className="mr-2">
          Save
        </Button>
        <Button className="mr-2" htmlType="button" onClick={hideEditForm}>
          Cancel
        </Button>
        {curTemplate._id && (
          <Popconfirm
            title="Are you sure delete this template?"
            onConfirm={onDeleteTemplate}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" htmlType="button">
              Delete
            </Button>
          </Popconfirm>
        )}
      </div>
    </Form>
  );
};

export default TemplateForm;
