import React, { useState } from "react";
import { Form, Input } from "antd";
import RichTextEditor from "../pages/editor";
import Avatar from "../template/upload";
import Tags from "../pages/tags_addons";

const CreateForm = ({
  createChallenge,
  hideChallengePage,
  updateChallenge,
  setAvatar,
  avatarURL,
  curChallenge,
  fieldData,
  label,
}) => {
  const [tags, setTags] = useState(curChallenge.tags || []);

  const onFinish = (values) => {
    values.logo = avatarURL;
    values.organization = curChallenge.organization || null;
    values.participant = curChallenge.participant || null;
    values.tags = tags;
    values.likes = curChallenge.likes || [];
    values.featured = curChallenge.featured || false;

    if (curChallenge._id) {
      values._id = curChallenge._id;
      updateChallenge(values);
    } else {
      createChallenge(values);
    }
    hideChallengePage();
  };

  return (
    <Form
      name="create-challenge"
      className="mt-3"
      onFinish={onFinish}
      initialValues={{ ...curChallenge }}
    >
      <div className="avatar-uploader mb-3">
        <Avatar setAvatar={setAvatar} imageUrl={avatarURL} />
      </div>
      <span>{label.titleChallenge} Title *</span>
      <Form.Item
        name="challenge_name"
        rules={[
          {
            required: true,
            message: `Please input the ${label.challenge} title!`,
          },
        ]}
      >
        <Input type="text" className="name" placeholder={"Title"} />
      </Form.Item>

      <span>
        Geography * - Specify the city, country, or region; multiple
        geographies, or global
      </span>
      <Form.Item
        name="geography"
        rules={[
          {
            required: true,
            message: "Please input the geography!",
          },
        ]}
      >
        <Input type="text" className="geography" placeholder={"Geography"} />
      </Form.Item>

      <span>Short Description (350 characters max) *</span>
      <Form.Item
        name="short_description"
        rules={[
          {
            required: true,
            message: "Please input the short description!",
          },
        ]}
      >
        <Input.TextArea
          className="shot-description"
          placeholder="Short Description"
          maxLength="350"
          rows={2}
        />
      </Form.Item>

      <span>
        Beneficiaries * - Who do you expect will benefit from addressing your{" "}
        {label.challenge}?
      </span>
      <Form.Item
        name="benefit"
        rules={[
          {
            required: true,
            message: "Please input the benefit!",
          },
        ]}
      >
        <Input type="text" className="benifit" placeholder={"Benefit"} />
      </Form.Item>

      <span>
        Stakeholders * - What stakeholders or groups need to be engaged to
        address your {label.challenge}?
      </span>
      <Form.Item
        name="stackholders"
        rules={[
          {
            required: true,
            message: "Please input the stakeholders!",
          },
        ]}
      >
        <Input type="text" className="benifit" placeholder={"Stakeholders"} />
      </Form.Item>

      <span>
        Keywords * - Enter keywords related to your {label.challenge} to make it
        easier for others to find it
      </span>
      <Form.Item
        name="keywords"
        rules={[
          {
            required: true,
            message: "Please input the keywords!",
          },
        ]}
      >
        <Input type="text" className="benifit" placeholder={"Keywords"} />
      </Form.Item>

      <span>
        Description (4000 characters max) * - Describe your Challenge in detail.
        <br />
        <b>These guiding questions may help:</b>
        <br />
        What is the specific problem that you aim to solve? What is the current
        context/situation? Who or what is it adversely affecting, and how? What
        is the scale or impact of the problem? What constraints must be
        considered when aiming to solve this issue? What outcome(s) will be
        achieved if your Challenge is adequately addressed?
      </span>
      <Form.Item
        name="description"
        rules={[
          {
            required: true,
            message: "Please input the description!",
          },
        ]}
      >
        <RichTextEditor placeholder="Description" limit={4000} />
      </Form.Item>

      <Tags
        fieldData={fieldData}
        tags={tags}
        updateTags={setTags}
        prefix={"challenge"}
      />
      <div className="flex btn-form-group mt-4">
        <button type="submit" className="btn-profile submit mr-2">
          Submit
        </button>
        <button className="btn-profile cancel" onClick={hideChallengePage}>
          Cancel
        </button>
      </div>
    </Form>
  );
};

class CreateChallenge extends React.Component {
  state = {
    avatarURL: "",
  };

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  render = () => {
    const { curChallenge } = this.props;
    return (
      <div className="login-page">
        <h4 className="mt-3 mb-4">
          {curChallenge._id ? "Update" : "Create"} {this.props.label.challenge}
        </h4>
        <CreateForm
          {...this.props}
          setAvatar={this.setAvatar}
          avatarURL={this.state.avatarURL || curChallenge.logo}
        />
      </div>
    );
  };
}

export default CreateChallenge;
