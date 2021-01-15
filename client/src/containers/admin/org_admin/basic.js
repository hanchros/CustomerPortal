import React from "react";
import { PageHeader, Button, Descriptions, Form, Input, Select } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { updateOrganization } from "../../../actions/organization";
import { getFieldData } from "../../../utils/helper";

const EditForm = ({ onUpdateOrg, org, orgTypes, onCancel }) => {
  const onFinish = async (values) => {
    values._id = org._id || null;
    await onUpdateOrg(values);
    onCancel();
  };

  return (
    <Form
      name="org_register"
      className="org-form mt-5"
      onFinish={onFinish}
      initialValues={{ ...org }}
    >
      <h5 className="mb-5">Edit Organization</h5>
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
          <PageHeader
            ghost={false}
            title={org.org_name}
            extra={[<Button key={3} onClick={this.onToggleEdit}>Edit</Button>]}
          >
            <Descriptions size="default" column={2}>
              <Descriptions.Item label="Creator">
                {org.creator.profile.first_name} {org.creator.profile.last_name}
              </Descriptions.Item>
              <Descriptions.Item label="Type">{org.org_type}</Descriptions.Item>
              <Descriptions.Item label="Creation Time">
                {moment(org.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {org.location}
              </Descriptions.Item>
              <Descriptions.Item label="Social">
                <a href={org.social} target="_blank" rel="noopener noreferrer">
                  {org.social}
                </a>
              </Descriptions.Item>
            </Descriptions>
            <span>Bio:</span>
            <div className="org-bio-box">{org.bio}</div>
          </PageHeader>
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
