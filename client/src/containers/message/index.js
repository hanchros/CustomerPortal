import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";
import { connect } from "react-redux";
import { SendOutlined, SearchOutlined } from "@ant-design/icons";
import {
  fetchMessages,
  sendReply,
  setOnMessage,
  setChannel,
  updateMessage,
  deleteMessage,
  blockChat,
} from "../../actions/message";
import { Tooltip, List, Comment, Input, Badge, Button, Mentions } from "antd";
import moment from "moment";
import UserAvatar from "../../assets/img/user-avatar.png";
import TeamIcon from "../../assets/img/team-icon.png";
import { Header } from "../../components/template";
import { getProject, getParticipant } from "../../actions/project";
import history from "../../history";

const { Option } = Mentions;

class MessageBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      receptor: "",
      receptorId: "",
      messageText: "",
      curMessageId: "",
      searchTxt: "",
      isTeamChat: false,
      inviteModal: false,
      inviteMembers: [],
    };
  }

  messagesEndRef = React.createRef();

  componentDidMount = async () => {
    const { setOnMessage, fetchMessages, message } = this.props;
    setOnMessage(true);
    if (message.channelId) {
      await fetchMessages(message.channelId);
      const conversations = message.conversations;
      for (let cv of conversations) {
        if (cv._id === message.channelId) {
          this.setState({
            isTeamChat: !!cv.project,
            receptor: cv.name || "",
            receptorId: cv.project ? cv.project._id : "",
          });
          break;
        }
      }
    }
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    this.props.setOnMessage(false);
  }

  onChangeSearch = (e) => {
    this.setState({ searchTxt: e.target.value });
  };

  scrollToBottom = () => {
    // this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  onClickConversation = async (cvId, name, id, isTeamChat) => {
    const { fetchMessages, setChannel, getProject } = this.props;
    await fetchMessages(cvId);
    setChannel(cvId);
    this.setState({ receptor: name, receptorId: id, isTeamChat });
    // this.scrollToBottom();
    if (isTeamChat) getProject(id);
  };

  renderMenuItem = (cv) => {
    const { user, message } = this.props;
    const { searchTxt } = this.state;
    let name = cv.name,
      photo,
      isTeamChat,
      id;
    if (!cv.project) {
      let users = cv.participants;
      if (users.length < 2) return null;
      let receptor = users[0];
      if (receptor._id === user._id) {
        receptor = users[1];
      }
      name = `${receptor.profile.first_name} ${receptor.profile.last_name}`;
      photo = receptor.profile.photo || UserAvatar;
      id = receptor._id;
      isTeamChat = false;
    } else {
      photo = cv.project.logo || TeamIcon;
      isTeamChat = true;
      id = cv.project._id;
    }
    if (searchTxt && !name.toLowerCase().includes(searchTxt.toLowerCase())) {
      return null;
    }

    return (
      <li
        key={cv._id}
        onClick={() => this.onClickConversation(cv._id, name, id, isTeamChat)}
        title={name}
        className={cv._id === message.channelId ? "active" : ""}
      >
        <img src={photo} alt="" />
        <span className="menu-name">{name}</span>
        <Badge count={cv.unread} style={{ backgroundColor: "#B5DC17" }} />
      </li>
    );
  };

  processMessage = () => {
    const { message } = this.props;
    const messages = message.messages || [];
    let result = [];
    for (let m of messages) {
      if (!m.author) continue;
      let author = `${m.author.profile.first_name} ${m.author.profile.last_name}`;
      let avatar = m.author.profile.photo || UserAvatar;
      let content = <p>{m.body}</p>;
      let datetime = (
        <Tooltip title={moment(m.createdAt).format("YYYY-MM-DD HH:mm:ss")}>
          <span>{moment(m.createdAt).fromNow()}</span>
        </Tooltip>
      );
      result.push({
        author,
        avatar,
        content,
        datetime,
        messageId: m._id,
        authorId: m.author._id,
        text: m.body,
      });
    }
    return result;
  };

  sendMessage = async () => {
    const {
      sendReply,
      updateMessage,
      fetchMessages,
      deleteMessage,
      message,
    } = this.props;
    const { curMessageId, messageText } = this.state;
    if (curMessageId) {
      if (messageText) {
        await updateMessage(curMessageId, messageText);
      } else {
        await deleteMessage(curMessageId, message.channelId);
      }
    } else {
      await sendReply(message.channelId, messageText);
    }
    await fetchMessages(message.channelId);
    this.setState({ messageText: "", curMessageId: "" });
    this.scrollToBottom();
  };

  mkCommentActions = (item) => {
    const { user, deleteMessage, message } = this.props;
    let actions = [];
    if (item.authorId !== user._id) return actions;
    actions.push(
      <span
        key="message-edit"
        className="text-underline"
        onClick={() =>
          this.setState({
            curMessageId: item.messageId,
            messageText: item.text,
          })
        }
      >
        Edit
      </span>
    );
    actions.push(
      <span
        key="comment-delete"
        className="text-underline"
        onClick={() => deleteMessage(item.messageId, message.channelId)}
      >
        Delete
      </span>
    );
    return actions;
  };

  getMemberNames = () => {
    const { message } = this.props;
    let curMemebers = [];
    for (let cv of message.conversations) {
      if (cv._id === message.channelId) {
        curMemebers = cv.participants.map((item) => {
          return `${item.profile.first_name} ${item.profile.last_name}`;
        });
        return curMemebers;
      }
    }
    return curMemebers;
  };

  goToProject = (projectId) => {
    history.push(`/project/${projectId}`);
  };

  render() {
    const { message } = this.props;
    const {
      messageText,
      receptor,
      searchTxt,
      isTeamChat,
      receptorId,
    } = this.state;
    const conversations = message.conversations;
    const memberNames = this.getMemberNames();
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Row>
            <Col md={4} className="mb-2 pr-4">
              <Input
                size="large"
                value={searchTxt}
                onChange={this.onChangeSearch}
                placeholder="Search"
                prefix={<SearchOutlined />}
              />
              <List
                className="message-list"
                itemLayout="horizontal"
                dataSource={conversations}
                renderItem={(item) => {
                  return this.renderMenuItem(item);
                }}
              />
            </Col>
            <Col md={8}>
              <div className="message-box">
                <div className="message-header">
                  <h5>
                    <b>
                      {isTeamChat ? "Team" : "User"} / {receptor}
                    </b>
                  </h5>
                  {isTeamChat && (
                    <Button onClick={() => this.goToProject(receptorId)}>
                      Back to project
                    </Button>
                  )}
                </div>
                <div className="message-board">
                  <List
                    className="comment-list"
                    itemLayout="horizontal"
                    dataSource={this.processMessage()}
                    renderItem={(item) => (
                      <li>
                        <Comment
                          actions={this.mkCommentActions(item)}
                          author={item.author}
                          avatar={item.avatar}
                          content={item.content}
                          datetime={item.datetime}
                        />
                      </li>
                    )}
                  />
                  <div ref={this.messagesEndRef} />
                </div>
                {message.channelId && (
                  <div className="message-input">
                    <Mentions
                      value={messageText}
                      onChange={(value) =>
                        this.setState({ messageText: value })
                      }
                      placeholder="Message"
                      rows={3}
                    >
                      {memberNames.map((name) => (
                        <Option key={name} value={name}>
                          {name}
                        </Option>
                      ))}
                    </Mentions>
                    <Button
                      type="ghost"
                      className="black-btn wide ml-3"
                      onClick={this.sendMessage}
                    >
                      Send <SendOutlined />
                    </Button>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    message: state.message,
    user: state.user.profile,
    project: state.project,
  };
}

export default connect(mapStateToProps, {
  fetchMessages,
  sendReply,
  setChannel,
  setOnMessage,
  updateMessage,
  deleteMessage,
  getProject,
  getParticipant,
  blockChat,
})(MessageBox);
