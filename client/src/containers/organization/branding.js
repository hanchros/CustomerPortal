import React from "react";
import { Row, Col } from "antd";
import { connect } from "react-redux";
import { getOrgByName } from "../../actions/organization";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { org_consts } from "../../constants";
import ChallengeIcon from "../../assets/icon/challenge.png";

class OrgBasics extends React.Component {
  constructor() {
    super();

    this.state = {
      org: { profile: {} },
    };
  }

  componentDidMount = async () => {
    const { match, getOrgByName } = this.props;
    let org_name = match.params.org_name;
    const org = await getOrgByName(org_name);
    if (org) this.setState({ org });
  };

  render() {
    const profile = this.state.org.profile;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="admin-org-box container">
            <Row gutter={50} className="mb-5">
              <Col md={12}>
                <div className="color-picker-box mb-3">
                  <span>Primary Color: </span>
                  <span className="brand-color-span">
                    <span>
                      ({profile.primary_color || org_consts.primary_color})
                    </span>
                    &nbsp;&nbsp;
                    <span
                      className="rc-color-picker-trigger"
                      style={{
                        backgroundColor:
                          profile.primary_color || org_consts.primary_color,
                      }}
                    />
                  </span>
                </div>
                <div className="color-picker-box mb-3">
                  <span>Background Color: </span>
                  <span className="brand-color-span">
                    <span>
                      ({profile.background_color || org_consts.background_color}
                      )
                    </span>
                    &nbsp;&nbsp;
                    <span
                      className="rc-color-picker-trigger"
                      style={{
                        backgroundColor:
                          profile.background_color ||
                          org_consts.background_color,
                      }}
                    />
                  </span>
                </div>
                <div className="color-picker-box mb-3">
                  <span>Menu Bar Color: </span>
                  <span className="brand-color-span">
                    <span>
                      ({profile.secondary_color || org_consts.secondary_color})
                    </span>
                    &nbsp;&nbsp;
                    <span
                      className="rc-color-picker-trigger"
                      style={{
                        backgroundColor:
                          profile.secondary_color || org_consts.secondary_color,
                      }}
                    />
                  </span>
                </div>
                <div className="color-picker-box mb-3">
                  <span>Menu Text Color: </span>
                  <span className="brand-color-span">
                    <span>
                      ({profile.menufont_color || org_consts.menufont_color})
                    </span>
                    &nbsp;&nbsp;
                    <span
                      className="rc-color-picker-trigger"
                      style={{
                        backgroundColor:
                          profile.menufont_color || org_consts.menufont_color,
                      }}
                    />
                  </span>
                </div>
              </Col>
              <Col md={12}>
                <div className="center mt-5">
                  <img
                    src={this.state.org.logo || ChallengeIcon}
                    alt=""
                    className="brand-logo"
                  />
                </div>
              </Col>
            </Row>
            <div className="admin-org-homebox">
              <span>Title page name:</span>
              <p>
                <b>{profile.title_page}</b>
              </p>
              <span>Title page description:</span>
              <div
                className="p-2"
                style={{
                  border: `1px solid ${
                    profile.primary_color || org_consts.primary_color
                  }`,
                }}
              >
                <p>{profile.title_page_description}</p>
              </div>
            </div>
          </div>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { getOrgByName })(OrgBasics);
