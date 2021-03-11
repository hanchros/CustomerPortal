import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { Form, Input, Button, Popconfirm } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../../actions/template";
import Technology from "./technology";
import { Header, Footer } from "../../components/template";

export const TemplateForm = ({
  curTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
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

  const onDeleteTemplate = async () => {
    await deleteTemplate(curTemplate._id);
    goback();
  };

  const onCancel = (e) => {
    e.preventDefault();
    goback();
  };

  return (
    <Form
      name="create-template"
      className="mt-4 register-form ml-auto mr-auto"
      onFinish={onFinish}
      initialValues={{ ...curTemplate }}
    >
      <div className="account-form-box">
        <span className="form-label">Name</span>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: `Please input the template name!`,
            },
          ]}
        >
          <Input type="text" className="name" size="large" />
        </Form.Item>
        <span className="form-label">Short description</span>
        <Form.Item name="objective">
          <Input size="large" />
        </Form.Item>
        <span className="form-label">Describe what are you automating?</span>
        <Form.Item name="description">
          <Input.TextArea rows={3} size="large" />
        </Form.Item>
        <p className="mb-4"></p>
      </div>
      <div className="account-form-box mt-5">
        <h5>
          <b>Technology</b>
        </h5>
        <Technology
          technologies={technologies}
          onChangeTechs={setTechnologies}
        />
      </div>
      <div className="flex mt-5" style={{ justifyContent: "space-between" }}>
        <div>
          {curTemplate._id && (
            <Popconfirm
              title="Are you sure delete this template?"
              onConfirm={onDeleteTemplate}
              okText="Yes"
              cancelText="No"
            >
              <Button type="ghost" className="ghost-btn wide">
                Delete template
              </Button>
            </Popconfirm>
          )}
        </div>
        <div className="flex">
          <Button type="ghost" onClick={onCancel} className="ghost-btn wide">
            Cancel
          </Button>
          <Button
            type="ghost"
            htmlType="submit"
            className="black-btn wide ml-3"
          >
            Save
          </Button>
        </div>
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
      deleteTemplate,
    } = this.props;
    return (
      <React.Fragment>
        <Header />
        <div className="account-nav">
          <Container>
            <Link to="#" onClick={goback}>
              <p>
                <LeftOutlined /> Go back
              </p>
            </Link>
          </Container>
        </div>
        <Container className="sub-content">
          <Row>
            <Col md={4}>
              <h4 className="mb-4">
                <b>Project template</b>
              </h4>
              <span>
                To save time when creating projects, save some basic parameters,
                that are similar organization to organization to a template​
              </span>
            </Col>
            <Col md={8}>
              <TemplateForm
                curTemplate={curTemplate}
                createTemplate={createTemplate}
                updateTemplate={updateTemplate}
                deleteTemplate={deleteTemplate}
                setTemplate={setTemplate}
                goback={goback}
                org={organization.currentOrganization}
              />
            </Col>
          </Row>
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
  deleteTemplate,
})(Template);
