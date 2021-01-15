import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { SettingOutlined } from "@ant-design/icons";
import { List, Button, Modal, Tooltip, Tag } from "antd";
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../../../actions/template";
import { Link } from "react-router-dom";
import EditTemplateForm from "./create-form";

class AdminTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      template: {},
    };
  }

  createNew = () => {
    this.setState({
      template: {},
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      template: {},
      visible: false,
    });
  };

  openEdit = (tp) => {
    this.setState({
      template: tp,
      visible: true,
    });
  };

  renderTemplateItem = (template) => (
    <List.Item className="template-li">
      <div style={{ width: "100%" }}>
        <div className="flex" style={{ justifyContent: "space-between" }}>
          <h5>{template.name}</h5>
          <Tooltip title="Edit">
            <Link to="#" onClick={() => this.openEdit(template)}>
              <SettingOutlined />
            </Link>
          </Tooltip>
        </div>
        <p>{template.description}</p>
        {template.creator && template.creator._id && (
          <span>organization: {template.creator.org_name}</span>
        )}
        <Tag color="green">{template.objective}</Tag>
      </div>
    </List.Item>
  );

  render() {
    const { template, visible } = this.state;
    const { createTemplate, updateTemplate, deleteTemplate, user } = this.props;
    const templates = this.props.template.globalTemplates;
    return (
      <div className="container">
        <Row>
          <Col className="flex">
            <h5 className="mr-auto mt-4 mb-4">Super Templates</h5>
          </Col>
        </Row>
        <List
          size="large"
          dataSource={templates}
          itemLayout="horizontal"
          renderItem={this.renderTemplateItem}
        />
        <Button type="primary" className="mt-4" onClick={this.createNew}>
          Add New
        </Button>
        {visible && (
          <Modal
            title={`${template._id ? "Update" : "Create"} Template`}
            visible={visible}
            width={800}
            footer={false}
            onCancel={this.hideModal}
          >
            <EditTemplateForm
              createTemplate={createTemplate}
              updateTemplate={updateTemplate}
              deleteTemplate={deleteTemplate}
              curTemplate={template}
              user={user}
              hideModal={this.hideModal}
            />
          </Modal>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    template: state.template,
    user: state.user.profile,
    organization: state.organization,
  };
}

export default connect(mapStateToProps, {
  createTemplate,
  updateTemplate,
  deleteTemplate,
})(AdminTemplate);
