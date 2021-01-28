import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Header, Footer } from "../../components/template";
import OrgLogo from "../../assets/icon/challenge.png";
import { getOrgByName } from "../../actions/organization";

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      org: { profile: {} },
    };
  }

  componentDidMount = async () => {
    const { match, getOrgByName, orgSettings } = this.props;
    let org_name = match.params.org_name;
    if (org_name && orgSettings.org_name !== org_name) {
      const org = await getOrgByName(org_name);
      if (org) this.setState({ org });
      else return
    }
  };
  render() {
    const { orgSettings } = this.props;
    const { org } = this.state;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Row>
            <Col xl={4} md={5} className="mb-3">
              <img
                src={orgSettings.logo || OrgLogo}
                alt="logo"
                className="org-dashboard-logo"
              />
            </Col>
            <Col xl={8} md={7}>
              <div className="detail-desc">
                <div className="project-header">
                  <h3>{orgSettings.title_page || orgSettings.org_name}</h3>
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
    orgSettings: state.organization.orgSettings,
  };
}

export default connect(mapStateToProps, { getOrgByName })(Dashboard);
