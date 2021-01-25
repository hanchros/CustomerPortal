import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { Button, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ChallengeLogo from "../../assets/icon/challenge.png";
import OrgInvite from "./invite-org";

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
    const { project, goback, orgSettings } = this.props;
    // let isCreator =
    //   project.project.participant &&
    //   project.project.participant._id === user._id;
    const { showInvite } = this.state;
    if (showInvite) {
      return <OrgInvite goback={this.onToggleInvite} />;
    }
    const organizations = project.organizations;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Button className="mb-4" type="link" onClick={goback}>
            <ArrowLeftOutlined /> Back
          </Button>
          <Row gutter={50}>
            <Col md={16} sm={24}>
              {organizations.map((org) => (
                <div key={org._id} className="project-org-box">
                  <div>
                    <img
                      src={org.organization.logo || ChallengeLogo}
                      alt=""
                    ></img>
                  </div>
                  <div
                    className="project-detail-desc"
                    style={{
                      borderColor: orgSettings.primary_color,
                    }}
                  >
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
            <Col md={8} sm={24}>
              <div className="center">
                <button
                  className="main-btn invite-org"
                  onClick={this.onToggleInvite}
                >
                  Invite New Client/Partner
                </button>
              </div>
            </Col>
          </Row>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    isAdmin: state.user.isAdmin,
    auth: state.auth,
    project: state.project,
    orgSettings: state.organization.orgSettings,
    fieldData: state.profile.fieldData,
  };
};

export default connect(mapStateToProps, {})(ProjectOrgs);
