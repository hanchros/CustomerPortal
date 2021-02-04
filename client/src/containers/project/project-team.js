import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { Button, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import UserIcon from "../../assets/img/user-avatar.png";
import Invite from "./invite";

class ProjectTeam extends Component {
  constructor() {
    super();

    this.state = {
      showInvite: false,
    };
  }

  onToggleInvite = () => {
    this.setState({ showInvite: !this.state.showInvite });
  };

  render = () => {
    const { project, goback, user } = this.props;
    const { showInvite } = this.state;
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
              <div className="project-general-box">
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
              <div>
                <h5>Project {pt.role}</h5>
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
  };
};

export default connect(mapStateToProps, {})(ProjectTeam);
