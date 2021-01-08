import React from "react";
import { Button, Form, Input, List, Avatar } from "antd";
import { Link } from "react-router-dom";
import TechImg from "../../assets/img/technology.png";
import {PlusOutlined} from "@ant-design/icons";

const TechnologyForm = ({ addTech, onCancel }) => {
  const onFinish = async (values) => {
    addTech(values);
  };

  return (
    <Form name="create-technology" className="mt-4" onFinish={onFinish}>
      <Form.Item
        name="application"
        rules={[
          {
            required: true,
            message: `Please input the application name!`,
          },
        ]}
      >
        <Input placeholder="Application" />
      </Form.Item>
      <Form.Item
        name="organization"
        rules={[
          {
            required: true,
            message: `Please input the organization name!`,
          },
        ]}
      >
        <Input placeholder="Organization" />
      </Form.Item>
      <Form.Item name="description">
        <Input.TextArea rows={3} placeholder="Description" />
      </Form.Item>
      <div className="flex">
        <Button type="primary" htmlType="submit" className="mr-2">
          Add
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
    };
  }

  onToggleShowForm = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  onAddTechnology = (tech) => {
    const { technologies } = this.state;
    const newTechArr = [...technologies, tech];
    this.setState({ showForm: false, technologies: newTechArr });
    this.props.onChangeTechs(newTechArr);
  };

  onRemoveTechnology = (index) => {
    const techs = this.state.technologies;
    techs.splice(index, 1);
    this.setState({ technologies: techs });
    this.props.onChangeTechs(techs);
  };

  render() {
    const { showForm, technologies } = this.state;
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
                </Link>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={TechImg} />}
                title={<b>{item.application}</b>}
                description={
                    <span>{item.organization}<br />{item.description}</span>
                }
              />
            </List.Item>
          )}
        />
        {!showForm && (
          <Button type="primary" shape="round" onClick={this.onToggleShowForm}>
            <PlusOutlined /> Add technology
          </Button>
        )}
        {showForm && (
          <TechnologyForm
            addTech={this.onAddTechnology}
            onCancel={this.onToggleShowForm}
          />
        )}
      </div>
    );
  }
}

export default Technology;
