import React from "react";
import { Row, Col, Input, Switch, Button } from "antd";
import { connect } from "react-redux";
import ColorPicker from "rc-color-picker";
import { updateOrganization } from "../../../actions/organization";
import { org_consts } from "../../../constants";
import Avatar from "../../../components/template/upload";
import { ModalSpinner } from "../../../components/pages/spinner";

class OrgBasics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarURL: props.organization.currentOrganization.logo,
      primary_color: "",
      secondary_color: "",
      background_color: "",
      menufont_color: "",
      title_page: "",
      title_page_description: "",
      loading: false,
    };
  }

  componentDidMount = () => {
    const org = this.props.organization.currentOrganization;
    this.setState({
      avatarURL: org.logo,
      primary_color: org.profile.primary_color || org_consts.primary_color,
      secondary_color:
        org.profile.secondary_color || org_consts.secondary_color,
      background_color:
        org.profile.background_color || org_consts.background_color,
      menufont_color: org.profile.menufont_color || org_consts.menufont_color,
      title_page: org.profile.title_page || org_consts.title_page,
      title_page_description:
        org.profile.title_page_description || org_consts.title_page_description,
    });
  };

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  onChangeOrgValue = (name, value) => {
    this.setState({ [name]: value });
  };

  onChangeDefaultColor = () => {
    this.setState({
      primary_color: org_consts.primary_color,
      secondary_color: org_consts.secondary_color,
      background_color: org_consts.background_color,
      menufont_color: org_consts.menufont_color,
    });
  };

  onChangeDefaultHome = () => {
    this.setState({
      title_page: org_consts.title_page,
      title_page_description: org_consts.title_page_description,
    });
  };

  updateOrg = async () => {
    const {
      avatarURL,
      primary_color,
      secondary_color,
      background_color,
      menufont_color,
      title_page,
      title_page_description,
    } = this.state;
    const org = this.props.organization.currentOrganization;
    this.setState({ loading: true });
    await this.props.updateOrganization({
      _id: org._id,
      logo: avatarURL,
      profile: {
        primary_color,
        secondary_color,
        background_color,
        menufont_color,
        title_page,
        title_page_description,
      },
    });
    this.setState({ loading: false });
  };

  checkEdited = () => {
    const {
      avatarURL,
      primary_color,
      secondary_color,
      background_color,
      menufont_color,
      title_page,
      title_page_description,
    } = this.state;
    const org = this.props.organization.currentOrganization;
    if (
      avatarURL !== org.logo ||
      primary_color !== org.profile.primary_color ||
      secondary_color !== org.profile.secondary_color ||
      background_color !== org.profile.background_color ||
      menufont_color !== org.profile.menufont_color ||
      title_page !== org.profile.title_page ||
      title_page_description !== org.profile.title_page_description
    )
      return true;
    return false;
  };

  render() {
    const {
      avatarURL,
      primary_color,
      secondary_color,
      background_color,
      menufont_color,
      title_page,
      title_page_description,
      loading,
    } = this.state;
    return (
      <div className="admin-org-box container">
        <Row gutter={50} className="mb-5">
          <Col md={12}>
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
              <span>Secondary Color:</span>
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
              <span>MenuFont Color:</span>
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
          <Col md={12}>
            <div className="center mt-5">
              <Avatar setAvatar={this.setAvatar} imageUrl={avatarURL} />
            </div>
          </Col>
        </Row>
        <div className="admin-org-homebox">
          <span>Title page name:</span>
          <Input
            value={title_page}
            placeholder="Title Page Name"
            onChange={(e) =>
              this.onChangeOrgValue("title_page", e.target.value)
            }
            className="mb-4"
          />
          <span>Title page description:</span>
          <Input.TextArea
            rows={3}
            value={title_page_description}
            placeholder="Title Page Description"
            onChange={(e) =>
              this.onChangeOrgValue("title_page_description", e.target.value)
            }
            className="mb-4"
          />
        </div>
        <div className="admin-org-toggle">
          <p>
            Use default home page?​{" "}
            <Switch onChange={this.onChangeDefaultHome} />
          </p>
          <p>
            Use default colors? <Switch onChange={this.onChangeDefaultColor} />
          </p>
        </div>
        <Button
          type="primary"
          className="mt-5"
          onClick={this.updateOrg}
          disabled={!this.checkEdited()}
        >
          Save
        </Button>
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

export default connect(mapStateToProps, { updateOrganization })(OrgBasics);
