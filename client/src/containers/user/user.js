import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import { Avatar, Skeleton } from "antd";
import { getProjectsByUser, listProjectByCreator } from "../../actions/project";
import { getUser } from "../../actions/auth";
import { Header, CustomCard } from "../../components/template";
import sampleUrl from "../../assets/img/user-avatar.png";
import ProjectAvatar from "../../assets/icon/challenge.png";
import UserTags from "./user-tag";

class UserDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      joinProjects: [],
      createdProjects: [],
      loading: false,
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    const userId = this.props.match.params.id;
    const { getProjectsByUser, listProjectByCreator, getUser } = this.props;

    const joinProjects = await getProjectsByUser(userId);
    const createdProjects = await listProjectByCreator(userId);
    const user = await getUser(userId);
    this.setState({
      joinProjects: joinProjects || [],
      createdProjects: createdProjects || [],
      user,
      loading: false,
    });
  };

  render = () => {
    const { user } = this.state;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          {user && (
            <div className="user-dashboard">
              {this.renderUserInfo(user)}
              {this.renderCreatedProjects()}
              {this.renderMemberProjects()}
              {this.renderFollowingProjects()}
            </div>
          )}
        </Container>
      </React.Fragment>
    );
  };

  renderUserInfo = (userData) => {
    const userInfo = userData.profile;
    if (!userInfo) {
      return this.renderSpin();
    }
    return (
      <Row>
        <Col xl={4} md={5} className="mb-3">
          <div className="user-card">
            <Avatar src={userInfo.photo || sampleUrl} size={200} />
          </div>
        </Col>
        <Col xl={8} md={7}>
          <h3>
            {userInfo.first_name} {userInfo.last_name}
          </h3>
          <h5 className="m-0">{userInfo.org_name}</h5>
          <h5>{userInfo.country}</h5>
          <div
            className="sun-editor-editable"
            dangerouslySetInnerHTML={{ __html: userInfo.personal_statement }}
          />
          <div className="social-icon d-flex">
            {userInfo.facebook && (
              <a
                href={userInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={require("../../assets/icon/facebook.png")}
                  alt="facebook"
                />
              </a>
            )}
            {userInfo.twitter && (
              <a
                href={userInfo.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={require("../../assets/icon/twitter.png")}
                  alt="twitter"
                />
              </a>
            )}
            {userInfo.linkedin && (
              <a
                href={userInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={require("../../assets/icon/linkedin.png")}
                  alt="linkedin"
                />
              </a>
            )}
            {userInfo.web && (
              <a href={userInfo.web} target="_blank" rel="noopener noreferrer">
                <img
                  src={require("../../assets/icon/challenge.png")}
                  alt="web"
                />
              </a>
            )}
          </div>
          <UserTags tags={userInfo.tags} contact={userInfo.contact} />
        </Col>
      </Row>
    );
  };

  renderCreatedProjects = () => {
    const { createdProjects } = this.state;
    if (createdProjects.length === 0) return null;

    return (
      <React.Fragment>
        <h5 className="mt-5">Project Created</h5>
        {this.renderSpin()}
        <Row>
          {createdProjects.map((item, index) => (
            <Col key={index} lg={4} md={6} sm={12}>
              <Link className="card-link" to={`/project/${item._id}`}>
                <CustomCard
                  logo={item.logo || ProjectAvatar}
                  title={item.name}
                  description={item.short_description}
                  status="In Progress"
                  likes={item.likes ? item.likes.length : 0}
                />
              </Link>
            </Col>
          ))}
        </Row>
      </React.Fragment>
    );
  };

  renderMemberProjects = () => {
    const { joinProjects } = this.state;
    const listItem = joinProjects.filter((item) => item.member === true);
    if (listItem.length === 0) return null;

    return (
      <React.Fragment>
        <h5 className="mt-5">Project Team Member</h5>
        {this.renderSpin()}
        <Row>
          {listItem.map((item, index) => {
            return (
              <Col key={index} lg={4} md={6} sm={12}>
                <Link className="card-link" to={`/project/${item.project._id}`}>
                  <CustomCard
                    logo={item.project.logo || ProjectAvatar}
                    title={item.project.name}
                    description={item.project.short_description}
                    status="In Progress"
                  />
                </Link>
              </Col>
            );
          })}
        </Row>
      </React.Fragment>
    );
  };

  renderFollowingProjects = () => {
    const { joinProjects } = this.state;
    const listItem = joinProjects.filter((item) => item.member !== true);
    if (listItem.length === 0) return null;

    return (
      <React.Fragment>
        <h5 className="mt-5">Project Followed</h5>
        {this.renderSpin()}
        <Row>
          {listItem.map((item, index) => {
            return (
              <Col key={index} lg={4} md={6} sm={12}>
                <Link className="card-link" to={`/project/${item.project._id}`}>
                  <CustomCard
                    logo={item.project.logo || ProjectAvatar}
                    title={item.project.name}
                    description={item.project.short_description}
                    status="In Progress"
                  />
                </Link>
              </Col>
            );
          })}
        </Row>
      </React.Fragment>
    );
  };

  renderSpin = () => {
    return (
      <Row>
        <Col className="center">
          <Skeleton active loading={this.state.loading} />
        </Col>
      </Row>
    );
  };
}
const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    isAdmin: state.user.isAdmin,
    fieldData: state.profile.fieldData,
  };
};

export default connect(mapStateToProps, {
  getProjectsByUser,
  listProjectByCreator,
  getUser,
})(UserDashboard);
