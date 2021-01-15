import React, { useState } from "react";
import { Form, Input, Button, Popconfirm, Divider, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import RichTextEditor from "../../../components/pages/editor";
import Avatar from "../../../components/template/upload";

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

  const onFinish = async (values) => {
    setLoading(true);
    values.image = avatarURL;
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
      <Form.Item name="content">
        <RichTextEditor placeholder="Content" />
      </Form.Item>
      <Form.Item name="video">
        <Input type="text" placeholder="Video Link" />
      </Form.Item>
      <div className="center mt-5">
        <Avatar setAvatar={setAvatar} imageUrl={avatarURL} />
      </div>
      <Form.Item
        className="mt-4"
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
              <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
                <Input
                  style={{ flex: "auto" }}
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                />
                <Button type="primary" className="ml-3" onClick={addNewTopic}>
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
      <div className="flex">
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
