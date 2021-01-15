import React, { useState } from "react";
import { Form, Input, Button, Popconfirm } from "antd";
import RichTextEditor from "../../components/pages/editor";
import Avatar from "../../components/template/upload";

const EditArticle = ({
  article,
  createArticle,
  updateArticle,
  deleteArticle,
  hideModal,
  topic,
  tag,
  refreshTopic
}) => {
  const [avatarURL, setAvatar] = useState(article.image || "");

  const onFinish = async (values) => {
    values.image = avatarURL;
    values.topic = topic;
    values.tag = tag;
    if (article._id) {
      values._id = article._id;
      await updateArticle(values);
    } else {
      await createArticle(values);
    }
    hideModal();
    refreshTopic(topic)
  };

  const hideEditForm = (e) => {
    e.preventDefault();
    hideModal();
  };

  const onDeleteArticle = async (e) => {
    e.preventDefault();
    await deleteArticle(article._id);
    hideModal();
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
