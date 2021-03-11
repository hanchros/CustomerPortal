import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import { Skeleton } from "antd";
import {
  listOrgTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../../../actions/template";
import { TemplateForm } from "../../template/create-form";
import TechLogo from "../../../assets/img/technology.png";
import TemplateLogo from "../../../assets/icon/template.svg";

class AdminTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreateTemplate: false,
      loading: false,
      curTemplate: {},
    };
  }

  componentDidMount = async () => {
    const { listOrgTemplate, organization } = this.props;
    this.setState({ loading: true });
    await listOrgTemplate(organization.currentOrganization._id);
    this.setState({ loading: false });
  };

  onToggleCreateTemplate = (template) => {
    this.setState({
      showCreateTemplate: !this.state.showCreateTemplate,
      curTemplate: template && template._id ? template : {},
    });
  };

  setUpdateTemplate = (template) => {
    this.setState({ curTemplate: template });
  };

  onDeleteTemplate = (id) => {
    this.props.deleteTemplate(id);
  };

  // renderTemplateItem = (template) => (
  //   <List.Item
  //     className="admin-org-template"
  //     actions={[
  //       <Popconfirm
  //         key={template._id}
  //         title="Are you sure to delete this template?"
  //         onConfirm={() => this.onDeleteTemplate(template._id)}
  //       >
  //         <Button type="link">Delete</Button>
  //       </Popconfirm>,
  //     ]}
  //   >
  //     <List.Item.Meta
  //       avatar={<Avatar src={TemplateImg} />}
  //       title={template.name}
  //       description={template.description}
  //       onClick={() => this.onToggleCreateTemplate(template)}
  //     />
  //   </List.Item>
  // );

  renderTemplateItem = (template) => (
    <div
      className="template-card"
      onClick={() => this.onToggleCreateTemplate(template)}
    >
      <div className="template-card-body">
        <h5>
          <b>{template.name}</b>
        </h5>
        <span style={{ opacity: 0.7 }}>{template.objective}</span>
      </div>
      <div className="template-card-techs">
        {template.technologies.slice(0, 2).map((tech) => (
          <div key={tech._id} className="flex">
            <img src={tech.icon || TechLogo} alt="" />
            <span className="ml-3">{tech.title}</span>
          </div>
        ))}
      </div>
    </div>
  );

  render() {
    const {
      template,
      organization,
      createTemplate,
      updateTemplate,
    } = this.props;
    const { showCreateTemplate, curTemplate, loading } = this.state;
    const templates = template.orgTemplates;

    if (showCreateTemplate) {
      return (
        <TemplateForm
          curTemplate={curTemplate}
          createTemplate={createTemplate}
          updateTemplate={updateTemplate}
          goback={this.onToggleCreateTemplate}
          org={organization.currentOrganization}
          setTemplate={this.setUpdateTemplate}
        />
      );
    }

    return (
      <React.Fragment>
        <h3>
          <b>Templates</b>
        </h3>
        <Skeleton active loading={loading} />
        <Row className="mt-5">
          {templates.map((tp) => (
            <Col key={tp._id} md={4} sm={6} xs={12}>
              {this.renderTemplateItem(tp)}
            </Col>
          ))}
          <Col md={4} sm={6} xs={12}>
            <div
              className="add-template-btn"
              onClick={this.onToggleCreateTemplate}
            >
              <img src={TemplateLogo} alt="" />
              <b className="mt-3">ADD NEW TEMPLATE</b>
            </div>
          </Col>
        </Row>
      </React.Fragment>
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
