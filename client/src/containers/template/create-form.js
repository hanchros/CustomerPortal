import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Form, Input } from "antd";
import { createTemplate, updateTemplate } from "../../actions/template";
import Technology from "./technology";
import { Header, Footer } from "../../components/template";

export const TemplateForm = ({
  curTemplate,
  createTemplate,
  updateTemplate,
  goback,
  org,
  setTemplate,
}) => {
  const [technologies, setTechnologies] = useState(
    curTemplate.technologies || []
  );

  const onFinish = async (values) => {
    values.creator = org._id;
    values.technologies = technologies.map((tech) => {
      return tech._id;
    });
    if (curTemplate._id) {
      values._id = curTemplate._id;
      let newTemp = await updateTemplate(values);
      setTemplate(newTemp);
    } else {
      await createTemplate(values);
    }
    goback();
  };

  return (
    <Form
      name="create-template"
      className="mt-4 register-form"
      onFinish={onFinish}
      initialValues={{ ...curTemplate }}
    >
      <span>Name:</span>
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: `Please input the template name!`,
          },
        ]}
      >
        <Input type="text" className="name" />
      </Form.Item>

      <span>Objective:</span>
      <Form.Item name="objective">
        <Input />
      </Form.Item>
      <p>What are you automating? Contracts, invoices, etc</p>
      <p className="mb-4"></p>
      <span>Description:</span>
      <Form.Item name="description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <p className="mb-4"></p>
      <span>Technology:</span>
      <Technology technologies={technologies} onChangeTechs={setTechnologies} />
      <div className="flex mt-5">
        <button type="submit" className="mr-4 main-btn">
          Submit
        </button>
        <button
          className="main-btn main-btn-secondary"
          onClick={(e) => {
            e.preventDefault();
            goback();
          }}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
};

class Template extends Component {
  render() {
    const {
      curTemplate,
      createTemplate,
      updateTemplate,
      goback,
      organization,
      setTemplate,
    } = this.props;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          {curTemplate._id && <h3>Update template</h3>}
          {!curTemplate._id && <h3>Creating new template</h3>}
          <p>
            To save time when creating projects, save some basic parameters,
            that are similar organization to organization to a template​
          </p>
          <TemplateForm
            curTemplate={curTemplate}
            createTemplate={createTemplate}
            updateTemplate={updateTemplate}
            setTemplate={setTemplate}
            goback={goback}
            org={organization.currentOrganization}
          />
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    organization: state.organization,
    template: state.template,
  };
}

export default connect(mapStateToProps, {
  createTemplate,
  updateTemplate,
})(Template);