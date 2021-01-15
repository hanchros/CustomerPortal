import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Button, Tag, Form, Input, Popover } from "antd";
import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import {
  getFieldData,
  getTargetFieldName,
  getTargetLabelFromSection,
} from "../../utils/helper";
import { createFieldData } from "../../actions/profile";

const AddTagForm = ({ name, createTag, hideForm }) => {
  const onFinish = async (values) => {
    await createTag({ field: name, value: values.field_value });
    hideForm();
  };
  return (
    <Form name="create-article" onFinish={onFinish}>
      <Form.Item
        name="field_value"
        rules={[
          {
            required: true,
            message: "Please input the tag name!",
          },
        ]}
      >
        <Input type="text" placeholder="Tag name" />
      </Form.Item>
      <Button type="primary" htmlType="submit" size="small">
        Submit
      </Button>
    </Form>
  );
};

class ListProperty extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tagIds: props.tags || [],
      fixedTagId: "",
      visible: false,
    };
  }

  componentDidMount = () => {
    const { fixedTag, prefix, fieldData } = this.props;
    const { tagIds } = this.state;
    const namelist = getTargetFieldName(prefix, fieldData);
    let fId = "";
    for (let name of namelist) {
      let filters = fieldData.filter(
        (item) =>
          item.value.toLowerCase() === fixedTag.toLowerCase() &&
          item.field === name
      );
      if (filters.length > 0) {
        fId = filters[0]._id;
        this.setState({ fixedTagId: fId });
        break;
      }
    }
    if (fId && tagIds.indexOf(fId) === -1) {
      let newTagIds = [fId, ...tagIds];
      this.setState({ tagIds: newTagIds });
      this.props.updateTags(newTagIds);
    }
  };

  handleOnClickTag = (tag) => {
    let tagIds = this.state.tagIds;
    let filters = tagIds.filter((item) => item === tag._id);
    if (filters.length === 0) {
      tagIds.push(tag._id);
      this.setState({ tagIds });
    }
    this.props.updateTags(tagIds);
  };

  handleOnRemoveTag = (tag) => {
    const { tagIds, fixedTagId } = this.state;
    if (tag._id === fixedTagId) return;
    for (let i = tagIds.length - 1; i >= 0; i--) {
      if (tagIds[i] === tag._id) {
        tagIds.splice(i, 1);
      }
    }
    this.setState({ tagIds });
    this.props.updateTags(tagIds);
  };

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  render = () => {
    const namelist = getTargetFieldName(
      this.props.prefix,
      this.props.fieldData
    );
    return (
      <Row className="mt-3 mb-3">
        <Col>
          {namelist.map((name, i) => {
            return this.renderTags(name, i);
          })}
        </Col>
      </Row>
    );
  };

  renderTags = (name, i) => {
    const { tagIds, fixedTagId } = this.state;
    const { fieldData, prefix, createFieldData } = this.props;
    let taglist = [];
    for (let tagId of tagIds) {
      let filters = fieldData.filter(
        (item) => item._id === tagId && item.field === name
      );
      if (filters.length > 0) taglist.push(filters[0]);
    }
    const label = getTargetLabelFromSection(prefix, name);
    const originTagList = getFieldData(fieldData, name);

    return (
      <React.Fragment key={i}>
        <h5 className="mt-4">{label}</h5>
        <Row className="m-0 mt-3 mb-2">
          {taglist.length > 0 &&
            taglist.map((item) => {
              return (
                <Tag
                  className={`site-tag-check mt-1 ${
                    item._id === fixedTagId && "fixed"
                  }`}
                  onClick={() => this.handleOnRemoveTag(item)}
                  key={item._id}
                >
                  <CheckOutlined />
                  &nbsp;{item.value}
                </Tag>
              );
            })}
        </Row>
        <Row className="search-title m-0 p-0 justify-content-between">
          <span>Select {label}</span>
        </Row>
        <Row className="m-0 mt-3">
          {originTagList.length > 0 &&
            originTagList.map((item) => {
              return (
                <Tag
                  className="site-tag-plus mt-1"
                  onClick={() => this.handleOnClickTag(item)}
                  key={item._id}
                >
                  <PlusOutlined />
                  &nbsp;{item.value}
                </Tag>
              );
            })}
          <Popover
            content={
              <AddTagForm
                name={name}
                createTag={createFieldData}
                hideForm={this.hide}
              />
            }
            title="Add Tag"
            trigger="click"
            visible={this.state.visible}
            onVisibleChange={this.handleVisibleChange}
          >
            <Button size="small" type="primary" className="mt-1 ml-3">
              Add
            </Button>
          </Popover>
        </Row>
      </React.Fragment>
    );
  };
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {
  createFieldData,
})(ListProperty);
