import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { Button, Row, Col, Modal, Input } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import UserIcon from "../../assets/img/user-avatar.png";
import Invite from "./invite";
import {
  startConversation,
  fetchOneConversation,
  createTeamChat,
  setChannel,
} from "../../actions/message";
import history from "../../history";

class ProjectTeam extends Component {
  constructor() {
    super();

    this.state = {
      showInvite: false,
      chosenParticipantId: "",
      visible: false,
      chatText: "",
    };
  }

  onToggleInvite = () => {
    this.setState({ showInvite: !this.state.showInvite });
  };

  haveChat = (participantId) => {
    let conversations = this.props.message.conversations;
    for (let cv of conversations) {
      if (cv.participants.length > 2) continue;
      let filters = cv.participants.filter((pt) => pt._id === participantId);
      if (filters.length > 0) return true;
    }
    return false;
  };

  toggleModal = async (ptId) => {
    if (ptId && this.haveChat(ptId)) {
      await this.props.fetchOneConversation(ptId);
      history.push("/messages");
      return;
    }
    this.setState({ visible: !this.state.visible, chosenParticipantId: ptId });
  };

  onChangeChat = (e) => {
    this.setState({ chatText: e.target.value });
  };

  handleOk = () => {
    const { chatText, chosenParticipantId } = this.state;
    if (!chatText || !chosenParticipantId) return;
    this.props.startConversation({
      recipient: chosenParticipantId,
      composedMessage: chatText,
    });
    this.toggleModal();
  };

  goTeamChat = async () => {
    const { project, message, createTeamChat, setChannel } = this.props;
    const curProj = project.project;
    let conversations = message.conversations;
    for (let cv of conversations) {
      if (cv.project && cv.project === curProj._id) {
        setChannel(cv._id);
        history.push("/messages");
        return;
      }
    }
    const cvId = await createTeamChat(curProj.name, curProj._id);
    setChannel(cvId);
    history.push("/messages");
  };

  render = () => {
    const { project, goback, user } = this.props;
    const { showInvite, visible, chatText } = this.state;
    let isCreator =
      project.project.participant &&
      project.project.participant._id === user._id;
    const participants = project.participants;
    const curProj = project.project;

    if (showInvite) {
      return <Invite goback={this.onToggleInvite} invite="team" />;
    }

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Button className="mb-4" type="link" onClick={goback}>
            <ArrowLeftOutlined /> Back
          </Button>
          <Row gutter={50} className="mb-5">
            <Col md={16} sm={24}>
              <div className="project-general-box mb-2">
                <h5>{curProj.name} Team</h5>
              </div>
            </Col>
            {isCreator && (
              <Col md={8} sm={24}>
                <div className="center">
                  <button className="main-btn" onClick={this.onToggleInvite}>
                    Invite New Member
                  </button>
                </div>
              </Col>
            )}
          </Row>
          {participants.map((pt) => (
            <div className="project-general-box mb-4" key={pt._id}>
              <div className="pr-4">
                <img src={pt.participant.profile.photo || UserIcon} alt="" />
              </div>
              <div style={{ width: "100%" }}>
                <div className="project-team-header">
                  <h5>Project {pt.role}</h5>
                  {user._id !== pt.participant._id && (
                    <Button
                      type="link"
                      onClick={() => this.toggleModal(pt.participant._id)}
                    >
                      Chat
                    </Button>
                  )}
                </div>
                <span>
                  {pt.participant.profile.first_name}{" "}
                  {pt.participant.profile.last_name} -{" "}
                  {pt.participant.profile.org_name}
                </span>
                <br />
                <span>Contact: {pt.participant.email}</span>
              </div>
            </div>
          ))}
          {isCreator && (
            <Button style={{ float: "right" }} onClick={this.goTeamChat}>
              TeamChat
            </Button>
          )}
          <Modal
            title={`Open Chat room with team member`}
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.toggleModal}
          >
            <Input.TextArea
              rows={2}
              onChange={this.onChangeChat}
              value={chatText}
              placeholder="Message"
            />
          </Modal>
        </Container>
        <Footer />
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    project: state.project,
    message: state.message,
  };
};

export default connect(mapStateToProps, {
  startConversation,
  fetchOneConversation,
  createTeamChat,
  setChannel,
})(ProjectTeam);
