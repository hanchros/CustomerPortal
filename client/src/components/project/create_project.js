import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import { Upload } from "../template";
import { Form, Input } from "antd";
import RichTextEditor from "../pages/editor";
import ProjectTags from "../pages/tags_addons";

const CreateForm = ({
  createProject,
  updateProject,
  hideProjectCreate,
  setAvatar,
  avatarURL,
  curProject,
  fieldData,
}) => {
  const [tags, setTags] = useState(curProject.tags || []);

  const onFinish = async (values) => {
    values.participant = curProject.participant;
    values.challenge = curProject.challenge;
    values.logo = avatarURL;
    values.tags = tags;
    values.sharers = curProject.sharers || [];
    values.likes = curProject.likes || [];
    let res;
    if (curProject._id) {
      values._id = curProject._id;
      res = await updateProject(values);
    } else {
      res = await createProject(values);
    }
    hideProjectCreate(res);
  };

  return (
    <Form
      name="create-challenge"
      className="mt-5"
      onFinish={onFinish}
      initialValues={{ ...curProject }}
    >
      <div className="avatar-uploader mb-5">
        <Upload setAvatar={setAvatar} imageUrl={avatarURL} />
      </div>
      <Row>
        <Col md={12}>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: `Please input the project name!`,
              },
            ]}
          >
            <Input type="text" className="name" placeholder={`Project Name`} />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item
            name="short_description"
            rules={[
              {
                required: true,
                message: `Please input the project short description!`,
              },
            ]}
          >
            <Input.TextArea
              className="short_description"
              placeholder="Short Description"
              maxLength="140"
              rows={3}
            />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item name="description">
            <RichTextEditor placeholder="Description" />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item name="contact_detail">
            <Input.TextArea
              placeholder={`How would you like potential project team members contact you?`}
              rows={3}
            />
          </Form.Item>
        </Col>
      </Row>
      <ProjectTags
        fieldData={fieldData}
        tags={tags}
        updateTags={setTags}
        prefix={"project"}
      />
      <div className="flex btn-form-group">
        <button type="submit" className="btn-profile submit mr-2">
          Submit
        </button>
        <button
          className="btn-profile cancel"
          onClick={(e) => {
            e.preventDefault();
            hideProjectCreate();
          }}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
};

export default CreateForm;
