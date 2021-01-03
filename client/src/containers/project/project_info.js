import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "reactstrap";
import { Popconfirm, Menu, Dropdown, Modal } from "antd";
import { EllipsisOutlined, LikeOutlined, LikeFilled } from "@ant-design/icons";
import {
  getParticipant,
  joinProject,
  leaveProject,
} from "../../actions/project";
import ProjectAvatar from "../../assets/icon/challenge.png";
import UserAvatar from "../../assets/img/user-avatar.png";
import EditProject from "./project-edit";
import ShareProject from "./project-share";
import Tags from "../../components/pages/tags";

class ProjectInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      modalContent: "",
    };
  }

  hideModal = () => {
    this.setState({ visible: false, modalContent: "" });
  };

  joinProject = async () => {
    await this.props.joinProject(this.props.projectId);
    await this.props.getParticipant(this.props.projectId);
  };

  leaveProject = async () => {
    await this.props.leaveProject(this.props.projectId);
    await this.props.getParticipant(this.props.projectId);
  };

  checkFollowProject = () => {
    const { participants } = this.props.project;
    const { user } = this.props;

    if (!user._id) return false;
    if (!participants || participants.length === 0) return false;
    for (let p of participants) {
      if (p.participant._id === user._id) return true;
    }
    return false;
  };

  checkIsTeamMember = () => {
    const { project, user } = this.props;
    const participants = project.participants;
    for (let pt of participants) {
      if (pt.participant._id === user._id && pt.member === true) {
        return true;
      }
    }
    return false;
  };

  onEditProject = () => {
    this.setState({
      visible: true,
      modalContent: "edit",
    });
  };

  onShareAccess = () => {
    this.setState({
      visible: true,
      modalContent: "share",
    });
  };

  handleUpvote = (vote) => {
    if (this.props.isCreator) return;
    this.props.upvoteProject(vote);
  };

  render() {
    const { curProj, isCreator, isAdmin, user, fieldData } = this.props;
    if (!curProj.likes) curProj.likes = [];
    let creator = curProj.participant ? curProj.participant.profile : {};
    const isVoter = curProj.likes.includes(user._id);

    const menu = (
      <Menu>
        <Menu.Item>
          <Link to="#" onClick={this.onEditProject}>
            Edit Project
          </Link>
        </Menu.Item>
        {(isCreator || isAdmin) && (
          <Menu.Item>
            <Link to="#" onClick={this.onShareAccess}>
              Share Access
            </Link>
          </Menu.Item>
        )}
      </Menu>
    );

    return (
      <Row>
        <Col xl={4} md={5} className="mb-3">
          <div className="project-card">
            <div className="avatar-img">
              <img src={curProj.logo || ProjectAvatar} alt="logo" />
            </div>
          </div>
          {curProj.contact_detail && (
            <div className="pt-3 pl-3 pr-3">
              Contact: {curProj.contact_detail}
            </div>
          )}
          <hr className="mr-3 ml-3" />
          <div className="project-user pl-3">
            <span>Created By</span>
            <Link
              to={`/participant/${
                curProj.participant && curProj.participant._id
              }`}
            >
              <img
                src={creator.photo || UserAvatar}
                alt=""
                title={creator.first_name}
              />
            </Link>
          </div>
        </Col>
        <Col xl={8} md={7}>
          <div className="detail-desc">
            <div className="project-header">
              <h3>{curProj.name}</h3>
              {(isCreator ||
                isAdmin ||
                (curProj.sharers && curProj.sharers.includes(user._id))) && (
                <Dropdown
                  overlay={menu}
                  placement="bottomCenter"
                  trigger={["click"]}
                >
                  <Button color="link" className="btn-project-access">
                    <EllipsisOutlined />
                  </Button>
                </Dropdown>
              )}
            </div>
            <p>{curProj.short_description}</p>
            {curProj.challenge && (
              <p className="produced-by">
                Addressing Challenge -{" "}
                <Link
                  className="challenge-link"
                  to={`/challenge/${curProj.challenge._id}`}
                >
                  {curProj.challenge.challenge_name}
                </Link>
              </p>
            )}
            <div
              className="sun-editor-editable"
              dangerouslySetInnerHTML={{ __html: curProj.description }}
            />
            <Tags
              fieldData={fieldData}
              tags={curProj.tags || []}
              prefix={"project"}
            />
            <p>
              {isVoter && (
                <Link to="#" onClick={() => this.handleUpvote(false)}>
                  <LikeFilled />
                </Link>
              )}
              {!isVoter && (
                <Link to="#" onClick={() => this.handleUpvote(true)}>
                  <LikeOutlined />
                </Link>
              )}
              <span> {curProj.likes.length}</span>
            </p>

            {!this.checkFollowProject() && !isCreator && (
              <div>
                <Popconfirm
                  title={`By following the project you will be sharing your email with the project creator. Follow project?`}
                  onConfirm={this.joinProject}
                  okText="Yes"
                  cancelText="No"
                >
                  <button className="hk_button mt-4">Follow Project</button>
                </Popconfirm>
              </div>
            )}
            <div className="project-unfollow">
              {this.checkFollowProject() && (
                <Button
                  outline
                  color="primary"
                  size="sm"
                  onClick={this.leaveProject}
                >
                  Leave Project
                </Button>
              )}
            </div>
          </div>
          <Modal
            title={`$Project Profile`}
            visible={this.state.visible}
            width={800}
            footer={false}
            onCancel={this.hideModal}
          >
            {curProj._id && this.state.modalContent === "edit" && (
              <EditProject id={curProj._id} hideModal={this.hideModal} />
            )}
            {curProj._id && this.state.modalContent === "share" && (
              <ShareProject id={curProj._id} hideModal={this.hideModal} />
            )}
          </Modal>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    project: state.project,
    isAdmin: state.user.isAdmin,
    fieldData: state.profile.fieldData,
  };
};

export default connect(mapStateToProps, {
  getParticipant,
  joinProject,
  leaveProject,
})(ProjectInfo);
