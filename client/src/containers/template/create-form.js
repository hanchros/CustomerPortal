import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Form, Input } from "antd";
import { createTemplate, updateTemplate } from "../../actions/template";
import Technology from "./technology";
import { Header } from "../../components/template";

const TemplateForm = ({
  curTemplate,
  createTemplate,
  updateTemplate,
  goback,
  user,
}) => {
  const [technologies, setTechnologies] = useState(
    curTemplate.technologies || []
  );

  const onFinish = async (values) => {
    values.creator = user._id;
    values.technologies = technologies;
    if (curTemplate._id) {
      values._id = curTemplate._id;
      await updateTemplate(values);
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
        <Input type="text" className="name" placeholder={`Name`} />
      </Form.Item>

      <span>Objective:</span>
      <Form.Item name="objective">
        <Input placeholder="Objective" />
      </Form.Item>
      <p>What are you automating? Contracts, invoices, etc</p>
      <p className="mb-4"></p>
      <span>Description:</span>
      <Form.Item name="description">
        <Input.TextArea rows={3} placeholder="Description" />
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
      user,
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
            goback={goback}
            user={user}
          />
        </Container>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    template: state.template,
  };
}

export default connect(mapStateToProps, {
  createTemplate,
  updateTemplate,
})(Template);
