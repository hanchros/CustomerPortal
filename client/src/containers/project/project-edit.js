import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Form, Input, Button, Checkbox } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { updateProject, createProject } from "../../actions/project";
import { createTemplate } from "../../actions/template";
import { Header, BigUpload, Footer } from "../../components/template";
import OrgInvite from "./invite";
import Technology from "../template/technology";

const CreateForm = ({
  createProject,
  updateProject,
  setAvatar,
  avatarURL,
  curProject,
  goback,
  gonext,
  user,
  template,
  createTemplate,
}) => {
  let techs = curProject.technologies || [];
  if (!curProject._id && template._id) {
    techs = template.technologies || [];
  }
  const [technologies, setTechnologies] = useState(techs);

  const onFinish = async (values) => {
    values.participant = user._id;
    values.logo = avatarURL;
    values.likes = curProject.likes || [];
    values.status = curProject.status || "Live";
    values.technologies = technologies.map((tech) => {
      return tech._id;
    });
    if (!curProject._id && template._id) {
      values.template = template._id;
    }
    if (values.create_template) {
      delete values.create_template;
      await createTemplate({
        name: values.name,
        description: values.description,
        objective: values.objective,
        technologies: values.technologies,
        creator: user.profile.org._id,
      });
    }
    if (curProject._id) {
      values._id = curProject._id;
      await updateProject(values);
      goback();
    } else {
      await createProject(values);
      gonext();
    }
  };

  const onCancel = (e) => {
    e.preventDefault();
    goback();
  };

  return (
    <Form
      name="create-project"
      className="mt-4 register-form"
      onFinish={onFinish}
      initialValues={curProject._id ? { ...curProject } : { ...template }}
    >
      <div className="account-form-box">
        <Row className="mb-4">
          <Col md={6}>
            <span className="form-label">Project name</span>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: `Please input the project name!`,
                },
              ]}
            >
              <Input type="text" className="name" size="large" />
            </Form.Item>
            <span className="form-label">Short description</span>
            <Form.Item name="objective">
              <Input size="large" />
            </Form.Item>
            <span className="form-label">
              Describe what are you automating?
            </span>
            <Form.Item name="description">
              <Input.TextArea rows={3} size="large" />
            </Form.Item>
          </Col>
          <Col md={6}>
            <div className="center mt-4">
              <BigUpload
                setAvatar={setAvatar}
                imageUrl={avatarURL}
                subject="project"
              />
            </div>
          </Col>
        </Row>
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
      {!template._id && (
        <div className="account-form-box mt-5">
          <Form.Item name="create_template" valuePropName="checked">
            <Checkbox>Create a new template from this project</Checkbox>
          </Form.Item>
        </div>
      )}
      <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
        <Button type="ghost" onClick={onCancel} className="ghost-btn">
          Cancel
        </Button>
        <Button type="ghost" htmlType="submit" className="black-btn ml-3">
          {curProject._id ? "Save" : "create project"}
        </Button>
      </div>
    </Form>
  );
};

class EditProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarURL: "",
      loading: false,
      curProject: {},
      showInvite: false,
    };
  }

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  onGoInvitePage = () => {
    this.setState({ showInvite: true });
  };

  render = () => {
    const { avatarURL, showInvite } = this.state;
    const {
      curProject,
      createProject,
      updateProject,
      goback,
      user,
      template,
      createTemplate,
    } = this.props;

    if (showInvite) return <OrgInvite />;

    return (
      <React.Fragment>
        <Header />
        <div className="account-nav">
          <Container>
            <Link to="#" onClick={goback}>
              <p>
                <LeftOutlined /> Back to Project
              </p>
            </Link>
          </Container>
        </div>
        <Container className="sub-content">
          <Row>
            <Col md={4}>
              <h4 className="mb-4">
                <b>{curProject._id ? "Update" : "Create"} project</b>
              </h4>
              <span>
                Some of the information was prefilled, but there might be some
                fields you need to complete.
              </span>
            </Col>
            <Col md={8}>
              <CreateForm
                createProject={createProject}
                updateProject={updateProject}
                createTemplate={createTemplate}
                setAvatar={this.setAvatar}
                avatarURL={avatarURL || curProject.logo}
                curProject={curProject}
                goback={goback}
                gonext={this.onGoInvitePage}
                user={user}
                template={template || {}}
              />
            </Col>
          </Row>
        </Container>
        <Footer />
      </React.Fragment>
    );
  };
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {
  createProject,
  updateProject,
  createTemplate,
})(EditProject);
