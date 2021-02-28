import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Button, Tag } from "antd";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { listOrgTemplate } from "../../actions/template";
import { Header, Footer } from "../../components/template";
import EditTemplate from "../template/create-form";
import EditProject from "../project/project-edit";
import history from "../../history";

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

  onGotoTemplate = (template) => {
    const { organization } = this.props;
    history.push(
      `/${organization.currentOrganization.org_name}/template/${template._id}`
    );
  };

  renderTemplateItem = (template) => (
    <div
      className="template-listitem"
      key={template._id}
      onClick={() => this.onGotoTemplate(template)}
    >
      <div>
        <b>{template.name}</b> <br/>
        <span style={{fontSize: "13px"}}>{template.description}</span>
      </div>
      {!template.creator && (
        <Tag color="green">
          Global Template
        </Tag>
      )}
    </div>
  );

  render() {
    const { template, goBack } = this.props;
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
        <div className="account-nav">
          <Container>
            <Link to="#" onClick={goBack}>
              <p>
                <LeftOutlined /> Go back
              </p>
            </Link>
          </Container>
        </div>
        <Container className="sub-content">
          <div className="templates-header">
            <h3>
              <b>Save time, use templates</b>
            </h3>
            <div className="flex">
              <Button
                type="ghost"
                className="ghost-btn mr-3"
                onClick={this.onCreateBlankProject}
              >
                create without template
              </Button>
              <Button
                type="ghost"
                className="black-btn"
                onClick={this.onToggleCreateTemplate}
              >
                <PlusOutlined /> create new template
              </Button>
            </div>
          </div>
          <hr className="mb-4" />
          {templates.map((item) => this.renderTemplateItem(item))}
          <div className="center mt-5">
            <b>why use templates?</b><br />
            <Link to="#" className="underline-link">
              Watch a short lesson
            </Link>
          </div>
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
