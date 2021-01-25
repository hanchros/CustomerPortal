import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { Button, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import InviteTeam from "./invite-team";

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
    const { project, goback, orgSettings } = this.props;
    // let isCreator =
    //   project.project.participant &&
    //   project.project.participant._id === user._id;
    const { showInvite } = this.state;
    if (showInvite) {
      return <InviteTeam goback={this.onToggleInvite} />;
    }
    const participants = project.participants;
    const curProj = project.project;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Button className="mb-4" type="link" onClick={goback}>
            <ArrowLeftOutlined /> Back
          </Button>
          <Row gutter={50} className="mb-5">
            <Col md={16} sm={24}>
              <div
                className="project-general-box"
                style={{
                  borderColor: orgSettings.primary_color,
                }}
              >
                <h5>{curProj.name} Team</h5>
              </div>
            </Col>
            <Col md={8} sm={24}>
              <div className="center">
                <button className="main-btn" onClick={this.onToggleInvite}>
                  Invite New Member
                </button>
              </div>
            </Col>
          </Row>
          {participants.map((pt) => (
            <div
              className="project-general-box mb-4"
              key={pt._id}
              style={{
                borderColor: orgSettings.primary_color,
              }}
            >
              <h5>Project {pt.role}</h5>
              <span>
                {pt.participant.profile.first_name}{" "}
                {pt.participant.profile.last_name}
              </span>
              <br />
              <span>Contact: {pt.participant.email}</span>
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
    isAdmin: state.user.isAdmin,
    auth: state.auth,
    orgSettings: state.organization.orgSettings,
    project: state.project,
    fieldData: state.profile.fieldData,
  };
};

export default connect(mapStateToProps, {})(ProjectTeam);
