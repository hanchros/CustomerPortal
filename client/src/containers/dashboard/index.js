import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Header, Footer } from "../../components/template";
import OrgLogo from "../../assets/icon/challenge.png";

class Dashboard extends Component {
  render() {
    const { organization } = this.props;
    const org = organization.currentOrganization
    const orgSettings = organization.orgSettings
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Row>
            <Col xl={4} md={5} className="mb-3">
              <img src={org.logo || OrgLogo} alt="logo" className="org-dashboard-logo" />
            </Col>
            <Col xl={8} md={7}>
              <div className="detail-desc">
                <div className="project-header">
                  <h3>{orgSettings.title_page || org.org_name}</h3>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="org-desc-box mt-4">
                {orgSettings.title_page_description || org.bio}
              </div>
            </Col>
          </Row>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    organization: state.organization,
  };
}

export default connect(mapStateToProps, {})(Dashboard);
