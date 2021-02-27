import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, Input, Modal, Popconfirm, Skeleton } from "antd";
import { EditOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  listTimeline,
  createTimeline,
  updateTimeline,
  deleteTimeline,
} from "../../actions/timeline";
import moment from "moment";
import { Link } from "react-router-dom";

const NoteForm = ({ onSubmit, note, onCancel }) => {
  const onFinish = async (values) => {
    values._id = note._id;
    await onSubmit(values);
    onCancel();
  };

  return (
    <Form
      name="create-note"
      className="mt-4 register-form p-2"
      onFinish={onFinish}
      initialValues={{ ...note }}
    >
      <span className="form-label">Note*</span>
      <Form.Item
        name="title"
        rules={[
          {
            required: true,
            message: `Please input the note!`,
          },
        ]}
      >
        <Input type="text" className="name" />
      </Form.Item>

      <span className="form-label">Description</span>
      <Form.Item name="description">
        <Input.TextArea rows={3} />
      </Form.Item>

      <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
        <Button
          type="ghost"
          onClick={(e) => {
            e.preventDefault();
            onCancel();
          }}
          className="ghost-btn"
        >
          Cancel
        </Button>
        <Button type="ghost" htmlType="submit" className="black-btn ml-3">
          Submit
        </Button>
      </div>
    </Form>
  );
};

class ProjectTech extends Component {
  constructor() {
    super();

    this.state = {
      visible: false,
      note: {},
      loading: false,
      openNote: 1000,
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    await this.props.listTimeline(this.props.id);
    this.setState({ loading: false });
  };

  hideModal = () => {
    this.setState({ visible: false, note: {} });
  };

  onCreateNote = () => {
    this.setState({ note: {}, visible: true });
  };

  onEdiitNote = (note) => {
    this.setState({ note, visible: true });
  };

  submitForm = async (values) => {
    const { createTimeline, updateTimeline, user, id } = this.props;
    const formValue = Object.assign({ creator: user._id, project: id }, values);
    if (values._id) {
      await updateTimeline(formValue);
    } else {
      await createTimeline(formValue);
    }
  };

  onDeleteNote = async (id) => {
    this.setState({ loading: true });
    await this.props.deleteTimeline(id);
    this.setState({ loading: false });
  };

  setOpenNote = (index) => {
    this.setState({ openNote: index });
  };

  render = () => {
    const { timeline, user } = this.props;
    const { visible, note, loading, openNote } = this.state;
    const timelines = timeline.timelines;

    return (
      <div className="project-timeline">
        <div className="timeline-header">
          <Button
            type="ghost"
            className="black-btn"
            onClick={this.onCreateNote}
          >
            <EditOutlined /> WRITE NOTE
          </Button>
        </div>
        <Skeleton active loading={loading} />
        <ul className="timeline-list">
          {timelines.map((tl, index) => (
            <li key={index}>
              <div className="timeline-item">
                <div className="timeline-title">
                  <span>
                    {tl.title}{" "}
                    {tl.description && openNote !== index && (
                      <Link to="#" onClick={() => this.setOpenNote(index)}>
                        see more
                      </Link>
                    )}
                    {tl.description && openNote === index && (
                      <Link to="#" onClick={() => this.setOpenNote(1000)}>
                        see less
                      </Link>
                    )}
                  </span>
                  {tl.description && openNote === index && (
                    <div className="timeline-description">{tl.description}</div>
                  )}
                </div>
                <span className="timeline-options">
                  {tl.creator && tl.creator._id === user._id && (
                    <React.Fragment>
                      <Link
                        to="#"
                        className="mr-2"
                        onClick={() => this.onEdiitNote(tl)}
                      >
                        <FormOutlined title="Edit" />
                      </Link>
                      <Popconfirm
                        title="Are you sure delete this note?"
                        onConfirm={() => this.onDeleteNote(tl._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined
                          style={{ color: "red" }}
                          className="mr-2"
                          title="Delete"
                        />
                      </Popconfirm>
                    </React.Fragment>
                  )}
                  <span style={{ opacity: 0.7 }}>
                    {moment(tl.createdAt).format("YYYY-MM-DD")}
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
        {visible && (
          <Modal
            title={`${note._id ? "Update" : "Create"} Note`}
            visible={visible}
            width={600}
            footer={false}
            onCancel={this.hideModal}
          >
            <NoteForm
              onSubmit={this.submitForm}
              note={note}
              onCancel={this.hideModal}
            />
          </Modal>
        )}
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    timeline: state.timeline,
  };
};

export default connect(mapStateToProps, {
  listTimeline,
  createTimeline,
  updateTimeline,
  deleteTimeline,
})(ProjectTech);
