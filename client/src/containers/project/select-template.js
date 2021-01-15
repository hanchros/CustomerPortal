import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { List, Tag } from "antd";
import { Link } from "react-router-dom";
import { listOrgTemplate } from "../../actions/template";
import { Header, Footer } from "../../components/template";
import EditTemplate from "../template/create-form";
import EditProject from "../project/project-edit";

class SeleteTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showCreateTemplate: false,
      selectedTemplate: {},
      showCreateProject: false,
    };
  }

  componentDidMount = async () => {
    const { listOrgTemplate, organization } = this.props;
    listOrgTemplate(organization.currentOrganization._id);
  };

  onToggleCreateTemplate = () => {
    this.setState({ showCreateTemplate: !this.state.showCreateTemplate });
  };

  onUseTemplate = (template) => {
    this.setState({ showCreateProject: true, selectedTemplate: template });
  };

  onCreateBlankProject = () => {
    this.setState({ showCreateProject: true, selectedTemplate: {} });
  };

  onGoBackProject = () => {
    this.setState({ showCreateProject: false, selectedTemplate: {} });
  };

  renderTemplateItem = (template) => (
    <List.Item className="template-listitem">
      <Link to={`/template/${template._id}`} className="template-listitem-body">
        <h5>
          <b>{template.name}</b>
          {!template.creator && (
            <Tag className="ml-5" color="green">
              Global Template
            </Tag>
          )}
        </h5>
        <p>{template.description}</p>
      </Link>
      <div>
        <button
          className="main-btn"
          onClick={() => this.onUseTemplate(template)}
        >
          Use Template
        </button>
      </div>
    </List.Item>
  );

  render() {
    const { template } = this.props;
    const templates = [...template.orgTemplates, ...template.globalTemplates];
    const {
      showCreateProject,
      showCreateTemplate,
      selectedTemplate,
    } = this.state;
    if (showCreateTemplate) {
      return (
        <EditTemplate curTemplate={{}} goback={this.onToggleCreateTemplate} />
      );
    }
    if (showCreateProject) {
      return (
        <EditProject
          curProject={{}}
          template={selectedTemplate}
          goback={this.onGoBackProject}
        />
      );
    }
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <p className="mb-4">
            Save time and use existing template to create a new project​
          </p>
          <List
            size="large"
            dataSource={templates}
            itemLayout="horizontal"
            renderItem={this.renderTemplateItem}
          />
          <div className="template-lesson">
            <Link to="#">Why templates? Watch a lesson</Link>
          </div>
          <button
            className="main-btn template-btn"
            onClick={this.onToggleCreateTemplate}
          >
            Create new template
          </button>
          <p className="mt-5">
            None of the templates work for this client? Create a blank project
            and you can save it as a template later
          </p>
          <button
            className="main-btn template-btn"
            onClick={this.onCreateBlankProject}
          >
            Create new project
          </button>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    template: state.template,
    organization: state.organization,
  };
}

export default connect(mapStateToProps, {
  listOrgTemplate,
})(SeleteTemplate);
