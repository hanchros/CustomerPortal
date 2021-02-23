import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Row, Container } from "reactstrap";
// import { Link } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getTemplate } from "../../actions/template";
import { Header, Footer } from "../../components/template";
import EditTemplate from "./create-form";
import EditProject from "../project/project-edit";
import history from "../../history";

class Template extends Component {
  constructor(props) {
    super(props);

    this.state = {
      template: {},
      showEditForm: false,
      showUseTemplate: false,
    };
  }

  onToggleEdit = () => {
    this.setState({ showEditForm: !this.state.showEditForm });
  };

  onToggleUseTemplate = () => {
    this.setState({ showUseTemplate: !this.state.showUseTemplate });
  };

  componentDidMount = async () => {
    const { getTemplate, match } = this.props;
    const template = await getTemplate(match.params.id);
    this.setState({ template: template || {} });
  };

  setUpdateTemplate = (template) => {
    this.setState({ template });
  };

  render() {
    const { template, showEditForm, showUseTemplate } = this.state;
    if (showEditForm) {
      return (
        <EditTemplate
          curTemplate={template}
          goback={this.onToggleEdit}
          setTemplate={this.setUpdateTemplate}
        />
      );
    }
    if (showUseTemplate) {
      return (
        <EditProject
          curProject={{}}
          template={template}
          goback={this.onToggleUseTemplate}
        />
      );
    }

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Button
            className="mb-4"
            type="link"
            onClick={() => {
              history.goBack();
            }}
          >
            <ArrowLeftOutlined /> Back
          </Button>
          <Row>
            <Col md={8}>
              <div className="template-name-box">
                <h2>{template.name}</h2>
                {template.creator && (
                  <span className="mr-5">
                    Creator: {template.creator.org_name}
                  </span>
                )}
                <span>Objective: {template.objective}</span>
              </div>
              <div className="template-desc-box">{template.description}</div>
            </Col>
            <Col md={4}>
              <button className="main-btn" onClick={this.onToggleUseTemplate}>
                Use Template
              </button>
              <div className="template-tech-box">
                <h5>Technology</h5>
                {template.technologies && (
                  <ul>
                    {template.technologies.map((tech) => (
                      <li key={tech.title}>{tech.title}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="template-tech-box">
                <h5>Asssociated Projects</h5>
                {template.projects && (
                  <ul>
                    {template.projects.map((proj) => (
                      <li key={proj.name}>{proj.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </Col>
          </Row>
          <button
            className="main-btn template-btn mt-5"
            onClick={this.onToggleEdit}
          >
            Edit
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
  };
}

export default connect(mapStateToProps, {
  getTemplate,
})(Template);
