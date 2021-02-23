import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ChallengeLogo from "../../assets/icon/challenge.png";
import Invite from "./invite";

class ProjectOrgs extends Component {
  constructor() {
    super();

    this.state = {
      showInvite: false,
    };
  }

  onToggleInvite = () => {
    this.setState({ showInvite: !this.state.showInvite });
  };

  render() {
    const { project, goback, user } = this.props;
    const { showInvite } = this.state;
    let isCreator =
      project.project.participant &&
      project.project.participant._id === user._id;
    const organizations = project.organizations;
    const curProj = project.project;

    if (showInvite) {
      return <Invite goback={this.onToggleInvite} />;
    }

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Button className="mb-4" type="link" onClick={goback}>
            <ArrowLeftOutlined /> Back
          </Button>
          <h5 className="mb-4">{curProj.name} Organizations</h5>
          <Row>
            <Col md={8}>
              {organizations.map((org) => (
                <div key={org._id} className="project-org-side">
                  <div>
                    <img
                      src={org.organization.logo || ChallengeLogo}
                      alt=""
                    ></img>
                  </div>
                  <div className="project-detail-desc">
                    <h5>{org.organization.org_name}</h5>
                    <ul>
                      {org.organization.org_type && (
                        <li>​{org.organization.org_type}</li>
                      )}
                      {org.organization.social && (
                        <li>​{org.organization.social}</li>
                      )}
                      {org.organization.location && (
                        <li>​{org.organization.location}</li>
                      )}
                      {org.organization.bio && <li>{org.organization.bio}</li>}
                    </ul>
                  </div>
                </div>
              ))}
            </Col>
            {isCreator && (
              <Col md={4}>
                <div className="center">
                  <button
                    className="main-btn invite-org"
                    onClick={this.onToggleInvite}
                  >
                    Invite New Client/Partner
                  </button>
                </div>
              </Col>
            )}
          </Row>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    project: state.project,
    user: state.user.profile,
  };
};

export default connect(mapStateToProps, {})(ProjectOrgs);
