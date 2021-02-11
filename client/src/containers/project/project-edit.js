import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Form, Input, Row, Col } from "antd";
import { updateProject, createProject } from "../../actions/project";
import { Header, Upload, Footer } from "../../components/template";
import Technology from "../template/technology";
import OrgInvite from "./invite";

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
      gonext();
    }
  };

  return (
    <Form
      name="create-project"
      className="mt-4 register-form"
      onFinish={onFinish}
      initialValues={curProject._id ? { ...curProject } : { ...template }}
    >
      <Row className="mb-4">
        <Col md={18} sm={24}>
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
            <Input type="text" className="name" />
          </Form.Item>
          <span>Short description:</span>
          <Form.Item name="objective">
            <Input />
          </Form.Item>
        </Col>
        <Col md={6} sm={24}>
          <div className="center mt-4">
            <Upload setAvatar={setAvatar} imageUrl={avatarURL} />
          </div>
        </Col>
      </Row>
      <span>Detailed description:</span>
      <Form.Item name="description">
        <Input.TextArea rows={3} />
      </Form.Item>
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
    } = this.props;

    if (showInvite) return <OrgInvite goback={goback} />;

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
            gonext={this.onGoInvitePage}
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
