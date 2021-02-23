import React, { useState } from "react";
import { Form, Input, Button, Popconfirm, Divider, Select, Switch } from "antd";
import { Col, Row } from "reactstrap";
import { PlusOutlined } from "@ant-design/icons";
import RichTextEditor from "../../../components/pages/editor";
import Avatar from "../../../components/template/upload";
import UploadFiles from "../../../components/template/upload_files";

const EditArticle = ({
  article,
  createArticle,
  updateArticle,
  deleteArticle,
  hideModal,
  setLoading,
  topics,
  tags,
}) => {
  const [newTopic, setNewTopic] = useState("");
  const [artTopics, setArtTopics] = useState(topics || []);
  const [avatarURL, setAvatar] = useState(article.image || "");
  const [iconURL, setIconURL] = useState(article.icon || "");
  const [files, setFiles] = useState(article.files || []);

  const onFinish = async (values) => {
    setLoading(true);
    values.image = avatarURL;
    values.files = files;
    values.icon = iconURL;
    if (article._id) {
      values._id = article._id;
      await updateArticle(values);
    } else {
      await createArticle(values);
    }
    hideModal();
    setLoading(false);
  };

  const hideEditForm = (e) => {
    e.preventDefault();
    hideModal();
  };

  const onDeleteArticle = async (e) => {
    e.preventDefault();
    setLoading(true);
    await deleteArticle(article._id);
    hideModal();
    setLoading(false);
  };

  const addNewTopic = () => {
    if (!newTopic || artTopics.indexOf(newTopic) > -1) return;
    setArtTopics([...artTopics, newTopic]);
    setNewTopic("");
  };

  return (
    <Form
      name="create-article"
      className="mt-4"
      onFinish={onFinish}
      initialValues={{ ...article }}
    >
      <Row className="mb-3">
        <Col md={3}>
          <div className="center">
            <Avatar setAvatar={setIconURL} imageUrl={iconURL} />
          </div>
        </Col>
        <Col md={9} style={{ paddingTop: "33px" }}>
          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                message: "Please input the article title!",
              },
            ]}
          >
            <Input type="text" placeholder="Title" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="content">
        <RichTextEditor placeholder="Content" />
      </Form.Item>
      <Form.Item name="video">
        <Input type="text" placeholder="Video Link" />
      </Form.Item>

      <Row className="mt-4">
        <Col md={8}>
          <Form.Item
            name="tag"
            rules={[
              {
                required: true,
                message: "Please choose the type!",
              },
            ]}
          >
            <Select placeholder="Article Type​">
              {tags.map((item) => {
                return (
                  <Select.Option key={item._id} value={item._id}>
                    {item.value}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="topic"
            rules={[
              {
                required: true,
                message: "Please input the topic!",
              },
            ]}
          >
            <Select
              placeholder="Article Topic"
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: "4px 0" }} />
                  <div
                    style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}
                  >
                    <Input
                      style={{ flex: "auto" }}
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                    />
                    <Button
                      type="primary"
                      className="ml-3"
                      onClick={addNewTopic}
                    >
                      <PlusOutlined /> Add item
                    </Button>
                  </div>
                </div>
              )}
            >
              {artTopics.map((item, index) => {
                return (
                  <Select.Option key={index} value={item}>
                    {item}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col md={4}>
          <div className="center">
            <Avatar setAvatar={setAvatar} imageUrl={avatarURL} />
          </div>
        </Col>
      </Row>

      <Form.Item name="iframe" className="mt-4">
        <Input type="text" placeholder="Iframe Link" />
      </Form.Item>

      <span>Upload Documents:</span>
      <br />
      <UploadFiles files={files} setFiles={setFiles} />

      <Row className="mt-4">
        <Col md={6}>
          <Form.Item
            name="show_iframe"
            label="Show Iframe"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item name="button_name" label="Go Button Caption">
            <Input type="text" placeholder="Go To Site" />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex mt-4">
        <Button type="primary" htmlType="submit" className="mr-2">
          Save
        </Button>
        <Button className="mr-2" onClick={hideEditForm}>
          Cancel
        </Button>
        {article._id && (
          <Popconfirm
            title="Are you sure delete this article?"
            onConfirm={onDeleteArticle}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        )}
      </div>
    </Form>
  );
};

export default EditArticle;
