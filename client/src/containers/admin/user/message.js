import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Radio, Button, Input, message } from "antd";
import RichTextEditor from "../../../components/pages/editor";
import {
  sendAllNotification,
  sendProjectCreatorNotification,
  sendOrgNotification,
} from "../../../actions/notification";

class Message extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: "participants",
      messageTxt: "",
      title: "",
    };
  }

  onChangeMode = (e) => {
    this.setState({ mode: e.target.value });
  };

  onChangeMessage = (e) => {
    this.setState({ messageTxt: e });
  };

  onChangeTitle = (e) => {
    this.setState({ title: e.target.value });
  };

  sendMessage = () => {
    const { mode, messageTxt, title } = this.state;
    const {
      sendAllNotification,
      sendProjectCreatorNotification,
      sendOrgNotification,
    } = this.props;

    if (!mode || !messageTxt || !title) {
      message.warn("All field are not filled correctly");
      return;
    }
    const data = { title, content: messageTxt };
    switch (mode) {
      case "participants":
        sendAllNotification(data);
        return;
      case "project_creators":
        sendProjectCreatorNotification(data);
        return;
      case "organizations":
        sendOrgNotification(data);
        return;
      default:
        return;
    }
  };

  render() {
    const { mode, messageTxt, title } = this.state;
    const { label } = this.props;
    return (
      <div className="content-admin">
        <Container>
          <Row>
            <Col className="flex">
              <h5 className="mr-auto">All {label.titleParticipant}</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <Radio.Group
                className="mt-4 mb-4"
                onChange={this.onChangeMode}
                value={mode}
              >
                <Radio value={"participants"} checked>
                  All {label.titleParticipant}
                </Radio>
                <Radio value={"project_creators"}>
                  {label.titleProject} Owners
                </Radio>
                <Radio value={"organizations"}>
                  {label.titleOrganization}
                </Radio>
              </Radio.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Input
                className="mb-3"
                value={title}
                onChange={this.onChangeTitle}
                placeholder="Title"
              />
              <RichTextEditor
                placeholder="Message"
                onChange={this.onChangeMessage}
                value={messageTxt}
              />
              <Button
                className="mt-3"
                onClick={this.sendMessage}
                type="primary"
              >
                Send Message
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { admin: state.admin, label: state.label };
}

export default connect(mapStateToProps, {
  sendAllNotification,
  sendProjectCreatorNotification,
  sendOrgNotification,
})(Message);
