import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Form, Input, List, Avatar, Select, Modal } from "antd";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import TechImg from "../../assets/img/technology.png";
import { PlusOutlined } from "@ant-design/icons";
import { getFieldDataByNameValue } from "../../utils/helper";
import { createArticle } from "../../actions/article";
import RichTextEditor from "../../components/pages/editor";
import UploadLogo from "../../components/template/upload";

const TechnologyForm = ({ addTech, onCancel, tagId, org }) => {
  const [avatarURL, setAvatar] = useState("");

  const onFinish = async (values) => {
    values.tag = tagId;
    values.topic = values.title;
    values.icon = avatarURL;
    values.order = -1;
    values.organization = org._id;
    addTech(values);
  };

  return (
    <Form name="create-technology" className="mt-4" onFinish={onFinish}>
      <Form.Item
        name="title"
        rules={[
          {
            required: true,
            message: "Please input the technology title!",
          },
        ]}
      >
        <Input type="text" placeholder="Title" />
      </Form.Item>
      <Form.Item name="content">
        <RichTextEditor placeholder="Content" />
      </Form.Item>
      <div className="center">
        <UploadLogo setAvatar={setAvatar} imageUrl={avatarURL} />
      </div>
      <div className="flex">
        <Button type="primary" htmlType="submit" className="mr-2">
          Create
        </Button>
        <Button
          type="default"
          onClick={(e) => {
            e.preventDefault();
            onCancel();
          }}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

class Technology extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showForm: false,
      technologies: props.technologies || [],
      exTech: {},
      visible: false,
    };
  }

  onToggleShowForm = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  onToggleModal = () => {
    this.setState({ visible: !this.state.visible });
  };

  onRemoveTechnology = (index) => {
    const techs = this.state.technologies;
    techs.splice(index, 1);
    this.setState({ technologies: techs });
    this.props.onChangeTechs(techs);
  };

  onChangeExTechs = (tech) => {
    const { articles } = this.props;
    const art = articles.filter((item) => item._id === tech);
    let exTech = {};
    if (art.length > 0) exTech = art[0];
    this.setState({ exTech });
  };

  addExTech = () => {
    const { technologies, exTech } = this.state;
    if (!exTech._id) return;
    const newTechArr = [...technologies, exTech];
    this.setState({ showForm: false, technologies: newTechArr, exTech: {} });
    this.props.onChangeTechs(newTechArr);
  };

  createTech = async (values) => {
    const { technologies } = this.state;
    let newTech = await this.props.createArticle(values);
    const newTechArr = [...technologies, newTech];
    this.setState({
      showForm: false,
      technologies: newTechArr,
      visible: false,
    });
    this.props.onChangeTechs(newTechArr);
  };

  getExTechs = (tagId, orgId) => {
    const { articles } = this.props;
    let exTechs = articles.filter(
      (item) => item.tag === tagId && item.organization === orgId
    );
    let globalTechs = articles.filter(
      (item) => item.tag === tagId && !item.organization
    );
    return [...exTechs, ...globalTechs];
  };

  render() {
    const { fieldData, organization } = this.props;
    const { showForm, technologies, exTech, visible } = this.state;
    const techTag = getFieldDataByNameValue(
      fieldData,
      "article_tag",
      "application"
    );
    const curOrg = organization.currentOrganization;
    const exTechs = this.getExTechs(techTag._id, curOrg._id);
    return (
      <div className="create-tech-box">
        <List
          itemLayout="horizontal"
          className="mb-3"
          dataSource={technologies}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Link to="#" onClick={() => this.onRemoveTechnology(index)}>
                  remove
                </Link>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.icon || item.image || TechImg} />}
                title={<b>{item.title}</b>}
              />
            </List.Item>
          )}
        />
        {!showForm && (
          <Button
            type="ghost"
            className="black-btn mt-4"
            onClick={this.onToggleShowForm}
          >
            <PlusOutlined /> Add technology
          </Button>
        )}
        {showForm && (
          <React.Fragment>
            <span>Add existing technology or create new</span>
            <Row>
              <Col md={6} sm={12}>
                <div className="flex mb-3">
                  <Select
                    placeholder="Select Technology​"
                    onChange={this.onChangeExTechs}
                    value={exTech._id}
                    className="mr-3"
                  >
                    {exTechs.map((item) => {
                      return (
                        <Select.Option key={item._id} value={item._id}>
                          {item.title}
                        </Select.Option>
                      );
                    })}
                  </Select>
                  <Button type="primary" onClick={this.addExTech}>
                    Add
                  </Button>
                </div>
              </Col>
              <Col md={6} sm={12}>
                <Button type="primary" onClick={this.onToggleModal}>
                  Create New Technology
                </Button>
              </Col>
            </Row>
          </React.Fragment>
        )}
        {visible && (
          <Modal
            title={`Create Technology`}
            visible={visible}
            width={800}
            footer={false}
            onCancel={this.onToggleModal}
          >
            <TechnologyForm
              addTech={this.createTech}
              onCancel={this.onToggleModal}
              tagId={techTag._id}
              org={curOrg}
            />
          </Modal>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    articles: state.article.articles,
    fieldData: state.profile.fieldData,
    organization: state.organization,
  };
}

export default connect(mapStateToProps, { createArticle })(Technology);
