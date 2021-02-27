import React, { useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { connect } from "react-redux";
import { updateOrganization } from "../../../actions/organization";
import { getFieldData, processLink } from "../../../utils/helper";
import ChallengeLogo from "../../../assets/icon/challenge.png";
import Avatar from "../../../components/template/upload";

const EditForm = ({ onUpdateOrg, org, orgTypes, onCancel }) => {
  const [avatarURL, setAvatar] = useState(org.logo || "");

  const onFinish = async (values) => {
    values._id = org._id || null;
    values.logo = avatarURL;
    values.social = processLink(values.social);
    values.linkedin = processLink(values.linkedin);
    await onUpdateOrg(values);
    onCancel();
  };

  return (
    <Form
      name="org_register"
      className="org-form"
      onFinish={onFinish}
      initialValues={{ ...org }}
    >
      <h5 className="mb-5">Edit Organization</h5>
      <div className="center mt-4 mb-4">
        <Avatar setAvatar={setAvatar} imageUrl={avatarURL} />
      </div>
      <Form.Item
        name="org_name"
        rules={[
          {
            required: true,
            message: "Please input the organization name!",
          },
        ]}
      >
        <Input placeholder="Organization Name" size="large" />
      </Form.Item>
      <Form.Item
        name="org_type"
        rules={[
          {
            required: true,
            message: "Please choose the type!",
          },
        ]}
      >
        <Select placeholder="Organization type​" size="large">
          {orgTypes.length > 0 &&
            orgTypes.map((item, index) => {
              return (
                <Select.Option key={index} value={item.value}>
                  {item.value}
                </Select.Option>
              );
            })}
        </Select>
      </Form.Item>
      <Form.Item
        name="location"
        rules={[
          {
            required: true,
            message: "Please input the organization location!",
          },
        ]}
      >
        <Input placeholder="Headquarters location" size="large" />
      </Form.Item>
      <Form.Item
        name="social"
        rules={[
          {
            required: true,
            message: "Please input the organization social media!",
          },
        ]}
      >
        <Input placeholder="Add social media" size="large" />
      </Form.Item>
      <Form.Item name="linkedin">
        <Input placeholder="Add Linkedin Link" size="large" />
      </Form.Item>
      <Form.Item name="bio">
        <Input.TextArea rows={5} size="large" placeholder="Bio" />
      </Form.Item>
      <div className="signup-btn">
        <Button type="primary" className="mr-3" htmlType="submit">
          Submit
        </Button>
        <Button
          type="default"
          onClick={(e) => {
            e.preventDefault();
            onCancel();
          }}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

class OrgBasics extends React.Component {
  constructor() {
    super();

    this.state = {
      isEdit: false,
    };
  }

  onToggleEdit = () => {
    this.setState({ isEdit: !this.state.isEdit });
  };

  render() {
    const { isEdit } = this.state;
    const { organization, updateOrganization, fieldData } = this.props;
    const org = organization.currentOrganization;
    const orgTypes = getFieldData(fieldData, "org_type");

    return (
      <div className="admin-org-box container">
        {isEdit && (
          <EditForm
            onUpdateOrg={updateOrganization}
            org={org}
            orgTypes={orgTypes}
            onCancel={this.onToggleEdit}
          />
        )}
        {!isEdit && (
          <div className="flex">
            <div className="admin-org-logobox">
              <img src={org.logo || ChallengeLogo} alt="" />
            </div>
            <div className="admin-org-body">
              <h4 className="mb-4">
                <b>{org.org_name}</b>
              </h4>
              <p>
                <b>Type:</b> {org.org_type}
              </p>
              <p>
                <b>Headquarters:</b> {org.location}
              </p>
              <p>
                <b>Website:</b> {org.social}
              </p>
              <p>
                <b>Linkedin:</b> {org.linkedin}
              </p>
              <p>
                <b>Creator:</b>{" "}
                {org.creator
                  ? `${org.creator.profile.first_name} ${org.creator.profile.last_name}`
                  : ""}
              </p>
              <b>About:</b>
              <div className="org-bio-box">{org.bio}</div>
              <button className="main-btn mt-4" onClick={this.onToggleEdit}>
                EDIT
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    org: state.organization.curret,
    organization: state.organization,
    fieldData: state.profile.fieldData,
  };
};

export default connect(mapStateToProps, { updateOrganization })(OrgBasics);
