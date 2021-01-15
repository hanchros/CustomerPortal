import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Form, Input } from "antd";
import { updateProject, createProject } from "../../actions/project";
import { Header, Upload, Footer } from "../../components/template";
import Technology from "../template/technology";

const CreateForm = ({
  createProject,
  updateProject,
  setAvatar,
  avatarURL,
  curProject,
  goback,
  user,
  template,
}) => {
  const [technologies, setTechnologies] = useState(
    curProject.technologies || template.technologies || []
  );

  const onFinish = async (values) => {
    values.participant = user._id;
    values.logo = avatarURL;
    values.likes = curProject.likes || [];
    values.status = curProject.status || "Live";
    values.technologies = technologies;
    if (!curProject._id && template._id) {
      values.template = template._id;
    }
    if (curProject._id) {
      values._id = curProject._id;
      await updateProject(values);
      goback();
    } else {
      await createProject(values);
      goback();
    }
  };

  return (
    <Form
      name="create-project"
      className="mt-4 register-form"
      onFinish={onFinish}
      initialValues={curProject._id ? { ...curProject } : { ...template }}
    >
      <span>Name:</span>
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: `Please input the project name!`,
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
      <span>Add logo:</span>
      <div className="avatar-uploader mb-4">
        <Upload setAvatar={setAvatar} imageUrl={avatarURL} />
      </div>
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

class EditProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarURL: "",
      loading: false,
      curProject: {},
    };
  }

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  render = () => {
    const { avatarURL } = this.state;
    const {
      curProject,
      createProject,
      updateProject,
      goback,
      user,
      template,
    } = this.props;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          {curProject._id && <h3>Update project</h3>}
          {!curProject._id && <h3>Creating new project</h3>}
          <CreateForm
            createProject={createProject}
            updateProject={updateProject}
            setAvatar={this.setAvatar}
            avatarURL={avatarURL || curProject.logo}
            curProject={curProject}
            goback={goback}
            user={user}
            template={template || {}}
          />
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
})(EditProject);
