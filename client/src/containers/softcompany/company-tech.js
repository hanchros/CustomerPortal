import React, { Component, useState } from "react";
import { Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { Avatar, Button, Modal, Popconfirm, Form, Input } from "antd";
import TechImg from "../../assets/img/technology.png";
import NonList from "../../components/pages/non-list";
import {
  listTechnology,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from "../../actions/technology";
import RichTextEditor from "../../components/pages/editor";
import { processLink } from "../../utils/helper";
import { BigUpload } from "../../components/template";

const TechnologyForm = ({
  curTech,
  hideModal,
  user,
  createTechnology,
  updateTechnology,
  deleteTechnology,
}) => {
  const [avatarURL, setAvatar] = useState(curTech.logo || "");

  const onFinish = async (values) => {
    values.logo = avatarURL;
    values.doc_url = processLink(values.doc_url);
    values.api_url = processLink(values.api_url);
    values.example_url = processLink(values.example_url);
    values.landing_url = processLink(values.landing_url);
    values.organization = user._id;
    if (curTech._id) {
      values._id = curTech._id;
      await updateTechnology(values);
    } else {
      await createTechnology(values);
    }
    hideModal();
  };

  const onCancel = (e) => {
    e.preventDefault();
    hideModal();
  };

  const onDelete = async (e) => {
    e.preventDefault();
    await deleteTechnology(curTech._id);
    hideModal();
  };

  return (
    <Form name="techform" onFinish={onFinish} initialValues={{ ...curTech }}>
      <Row>
        <Col md={4} className="mb-4">
          <h4 className="mb-4">
            <b>{curTech.title || "New Technology"}</b>
          </h4>
          <BigUpload
            setAvatar={setAvatar}
            imageUrl={avatarURL}
            subject="technology"
          />
          {curTech._id && (
            <Popconfirm
              title="Are you sure delete this technology?"
              onConfirm={onDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger className="mt-4">
                Delete Technology
              </Button>
            </Popconfirm>
          )}
        </Col>
        <Col md={8}>
          <div className="sc-invite-form">
            <div className="form-box">
              <span className="form-label">Title*</span>
              <Form.Item
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please input the title!",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <span className="form-label">Content</span>
              <Form.Item name="content">
                <RichTextEditor size="large" />
              </Form.Item>
            </div>
            <div className="form-box">
              <h5 className="mb-4">
                <b>Your offerings</b>
              </h5>
              <span className="form-label">Describe your service*</span>
              <Form.Item
                name="service"
                rules={[
                  {
                    required: true,
                    message: "Please describe your service!",
                  },
                ]}
              >
                <Input.TextArea rows={3} size="large" />
              </Form.Item>
              <span className="form-label">Documentation URL</span>
              <Form.Item name="doc_url">
                <Input size="large" placeholder="https://" />
              </Form.Item>
              <span className="form-label">API URL</span>
              <Form.Item name="api_url">
                <Input size="large" placeholder="https://" />
              </Form.Item>
              <span className="form-label">Example URL</span>
              <Form.Item name="example_url">
                <Input size="large" placeholder="https://" />
              </Form.Item>
              <span className="form-label">Landing page URL</span>
              <Form.Item name="landing_url">
                <Input size="large" placeholder="https://" />
              </Form.Item>
            </div>
          </div>
          <div className="flex mt-4" style={{ justifyContent: "flex-end" }}>
            <Button type="ghost" className="ghost-btn" onClick={onCancel}>
              Close
            </Button>
            <Button type="ghost" htmlType="submit" className="black-btn ml-3">
              Save Changes
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

class CompanyTechs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      curTech: {},
    };
  }

  componentDidMount = async () => {
    const { listTechnology, user } = this.props;
    await listTechnology(user._id);
  };

  onOpenTechModal = (tech = {}) => {
    this.setState({ showModal: true, curTech: tech });
  };

  onHideTechModal = () => {
    this.setState({ showModal: false, curTech: {} });
  };

  render = () => {
    const {
      user,
      technology,
      createTechnology,
      updateTechnology,
      deleteTechnology,
    } = this.props;
    const { showModal, curTech } = this.state;
    const technologies = technology.technologies;
    return (
      <React.Fragment>
        <div className="tech-btns">
          <Button
            type="ghost"
            className="ghost-btn"
            onClick={() => this.onOpenTechModal()}
          >
            Add technology
          </Button>
        </div>
        {technologies.length === 0 && (
          <NonList
            title="You have no technologies yet"
            description="Use buttons above to add technologies."
          />
        )}
        {technologies.length > 0 && (
          <ul className="project-tech-items">
            {technologies.map((item) => (
              <li key={item._id} onClick={() => this.onOpenTechModal(item)}>
                <Avatar src={item.logo || TechImg} />
                <b>{item.title}</b>
              </li>
            ))}
          </ul>
        )}
        {showModal && (
          <Modal
            title="Company Technology"
            visible={showModal}
            width={900}
            footer={false}
            onCancel={this.onHideTechModal}
          >
            <TechnologyForm
              curTech={curTech}
              hideModal={this.onHideTechModal}
              user={user}
              createTechnology={createTechnology}
              updateTechnology={updateTechnology}
              deleteTechnology={deleteTechnology}
            />
          </Modal>
        )}
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    technology: state.technology,
  };
};

export default connect(mapStateToProps, {
  listTechnology,
  createTechnology,
  updateTechnology,
  deleteTechnology,
})(CompanyTechs);
