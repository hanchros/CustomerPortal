import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Button, List, Popconfirm } from "antd";
import {
  listOrgTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../../../actions/template";
import { TemplateForm } from "../../template/create-form";
import TemplateImg from "../../../assets/img/template.png";
import Avatar from "antd/lib/avatar/avatar";

class AdminTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreateTemplate: false,
      curTemplate: {},
    };
  }

  componentDidMount = async () => {
    const { listOrgTemplate, organization } = this.props;
    listOrgTemplate(organization.currentOrganization._id);
  };

  onToggleCreateTemplate = (template) => {
    this.setState({
      showCreateTemplate: !this.state.showCreateTemplate,
      curTemplate: template && template._id ? template : {},
    });
  };

  onDeleteTemplate = (id) => {
    this.props.deleteTemplate(id);
  };

  renderTemplateItem = (template) => (
    <List.Item
      className="admin-org-template"
      actions={[
        <Popconfirm
          key={template._id}
          title="Are you sure to delete this template?"
          onConfirm={() => this.onDeleteTemplate(template._id)}
        >
          <Button type="link">Delete</Button>
        </Popconfirm>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={TemplateImg} />}
        title={template.name}
        description={template.description}
        onClick={() => this.onToggleCreateTemplate(template)}
      />
    </List.Item>
  );

  render() {
    const {
      template,
      organization,
      createTemplate,
      updateTemplate,
    } = this.props;
    const { showCreateTemplate, curTemplate } = this.state;

    const templates = template.orgTemplates;
    return (
      <Container className="admin-org-box">
        {showCreateTemplate && (
          <TemplateForm
            curTemplate={curTemplate}
            createTemplate={createTemplate}
            updateTemplate={updateTemplate}
            goback={this.onToggleCreateTemplate}
            org={organization.currentOrganization}
          />
        )}
        {!showCreateTemplate && (
          <React.Fragment>
            <List
              size="large"
              dataSource={templates}
              itemLayout="horizontal"
              renderItem={this.renderTemplateItem}
            />
            <button
              className="main-btn template-btn mt-5 ml-4"
              onClick={this.onToggleCreateTemplate}
            >
              Add Template
            </button>
          </React.Fragment>
        )}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    template: state.template,
    organization: state.organization,
  };
}

export default connect(mapStateToProps, {
  listOrgTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
})(AdminTemplate);
