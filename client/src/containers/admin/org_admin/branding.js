import React from "react";
import { Switch, Button } from "antd";
import { Col, Row } from "reactstrap";
import { connect } from "react-redux";
import ColorPicker from "rc-color-picker";
import {
  updateOrganization,
  testColorChange,
} from "../../../actions/organization";
import { org_consts } from "../../../constants";
import { ModalSpinner } from "../../../components/pages/spinner";

class OrgBasics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      primary_color: "",
      secondary_color: "",
      background_color: "",
      menufont_color: "",
      font_color: "",
      link_color: "",
      shadow_color: "",
      loading: false,
    };
  }

  componentDidMount = () => {
    const org = this.props.organization.currentOrganization;
    this.setState({
      primary_color: org.profile.primary_color || org_consts.primary_color,
      secondary_color:
        org.profile.secondary_color || org_consts.secondary_color,
      background_color:
        org.profile.background_color || org_consts.background_color,
      menufont_color: org.profile.menufont_color || org_consts.menufont_color,
      font_color: org.profile.font_color || org_consts.font_color,
      link_color: org.profile.link_color || org_consts.link_color,
      shadow_color: org.profile.shadow_color || org_consts.shadow_color,
    });
  };

  onChangeOrgValue = (name, value) => {
    let org_name = this.props.organization.currentOrganization.org_name;
    let states = this.state;
    states[name] = value;
    this.props.testColorChange(states, org_name);
    this.setState({ [name]: value });
  };

  onChangeDefaultColor = () => {
    let org_name = this.props.organization.currentOrganization.org_name;
    let states = this.state;
    states.primary_color = org_consts.primary_color;
    states.secondary_color = org_consts.secondary_color;
    states.background_color = org_consts.background_color;
    states.menufont_color = org_consts.menufont_color;
    states.shadow_color = org_consts.shadow_color;
    states.font_color = org_consts.font_color;
    states.link_color = org_consts.link_color;
    this.props.testColorChange(states, org_name);
    this.setState({
      primary_color: org_consts.primary_color,
      secondary_color: org_consts.secondary_color,
      background_color: org_consts.background_color,
      menufont_color: org_consts.menufont_color,
      shadow_color: org_consts.shadow_color,
      font_color: org_consts.font_color,
      link_color: org_consts.link_color,
    });
  };

  updateOrg = async () => {
    const {
      primary_color,
      secondary_color,
      background_color,
      menufont_color,
      font_color,
      link_color,
      shadow_color,
    } = this.state;
    const org = this.props.organization.currentOrganization;
    this.setState({ loading: true });
    await this.props.updateOrganization({
      _id: org._id,
      profile: {
        primary_color,
        secondary_color,
        background_color,
        menufont_color,
        font_color,
        link_color,
        shadow_color,
      },
    });
    this.setState({ loading: false });
  };

  checkEdited = () => {
    const {
      primary_color,
      secondary_color,
      background_color,
      menufont_color,
      font_color,
      link_color,
      shadow_color,
    } = this.state;
    const org = this.props.organization.currentOrganization;
    if (
      primary_color !== org.profile.primary_color ||
      secondary_color !== org.profile.secondary_color ||
      background_color !== org.profile.background_color ||
      menufont_color !== org.profile.menufont_color ||
      font_color !== org.profile.font_color ||
      link_color !== org.profile.link_color ||
      shadow_color !== org.profile.shadow_color
    )
      return true;
    return false;
  };

  refreshChange = () => {
    const org = this.props.organization.currentOrganization;
    const org_name = this.props.organization.currentOrganization.org_name;
    const newState = {
      primary_color: org.profile.primary_color || org_consts.primary_color,
      secondary_color:
        org.profile.secondary_color || org_consts.secondary_color,
      background_color:
        org.profile.background_color || org_consts.background_color,
      menufont_color: org.profile.menufont_color || org_consts.menufont_color,
      font_color: org.profile.font_color || org_consts.font_color,
      link_color: org.profile.link_color || org_consts.link_color,
      shadow_color: org.profile.shadow_color || org_consts.shadow_color,
    };
    this.props.testColorChange(newState, org_name);
    this.setState(newState);
  };

  render() {
    const {
      primary_color,
      secondary_color,
      background_color,
      menufont_color,
      font_color,
      link_color,
      shadow_color,
      loading,
    } = this.state;
    return (
      <div className="admin-org-box container">
        <Row className="mb-4">
          <Col md={6}>
            <div className="color-picker-box">
              <span>Primary Color:</span>
              <ColorPicker
                color={primary_color}
                alpha={100}
                onClose={(colors) =>
                  this.onChangeOrgValue("primary_color", colors.color)
                }
                placement="topLeft"
                className="some-class"
              >
                <span className="rc-color-picker-trigger" />
              </ColorPicker>
            </div>
            <div className="color-picker-box">
              <span>Background Color:</span>
              <ColorPicker
                color={background_color}
                alpha={100}
                onClose={(colors) =>
                  this.onChangeOrgValue("background_color", colors.color)
                }
                placement="topLeft"
                className="some-class"
              >
                <span className="rc-color-picker-trigger" />
              </ColorPicker>
            </div>
            <div className="color-picker-box">
              <span>Menu Bar Color:</span>
              <ColorPicker
                color={secondary_color}
                alpha={100}
                onClose={(colors) =>
                  this.onChangeOrgValue("secondary_color", colors.color)
                }
                placement="topLeft"
                className="some-class"
              >
                <span className="rc-color-picker-trigger" />
              </ColorPicker>
            </div>
            <div className="color-picker-box">
              <span>Menu Text Color:</span>
              <ColorPicker
                color={menufont_color}
                alpha={100}
                onClose={(colors) =>
                  this.onChangeOrgValue("menufont_color", colors.color)
                }
                placement="topLeft"
                className="some-class"
              >
                <span className="rc-color-picker-trigger" />
              </ColorPicker>
            </div>
          </Col>
          <Col md={6}>
            <div className="color-picker-box">
              <span>Main Font Color:</span>
              <ColorPicker
                color={font_color}
                alpha={100}
                onClose={(colors) =>
                  this.onChangeOrgValue("font_color", colors.color)
                }
                placement="topLeft"
                className="some-class"
              >
                <span className="rc-color-picker-trigger" />
              </ColorPicker>
            </div>
            <div className="color-picker-box">
              <span>Main Link Color:</span>
              <ColorPicker
                color={link_color}
                alpha={100}
                onClose={(colors) =>
                  this.onChangeOrgValue("link_color", colors.color)
                }
                placement="topLeft"
                className="some-class"
              >
                <span className="rc-color-picker-trigger" />
              </ColorPicker>
            </div>
            <div className="color-picker-box">
              <span>Main Shadow Color:</span>
              <ColorPicker
                color={shadow_color}
                alpha={100}
                onClose={(colors) =>
                  this.onChangeOrgValue("shadow_color", colors.color)
                }
                placement="topLeft"
                className="some-class"
              >
                <span className="rc-color-picker-trigger" />
              </ColorPicker>
            </div>
          </Col>
        </Row>
        <div className="admin-org-toggle">
          <p>
            Use default colors? <Switch onChange={this.onChangeDefaultColor} />
          </p>
        </div>
        <div className="flex mt-5">
          <Button
            type="primary"
            className="mr-3"
            onClick={this.updateOrg}
            disabled={!this.checkEdited()}
          >
            Save
          </Button>
          {this.checkEdited() && (
            <Button type="default" onClick={this.refreshChange}>
              Cancel
            </Button>
          )}
        </div>
        <ModalSpinner visible={loading} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    organization: state.organization,
    fieldData: state.profile.fieldData,
  };
};

export default connect(mapStateToProps, {
  updateOrganization,
  testColorChange,
})(OrgBasics);
