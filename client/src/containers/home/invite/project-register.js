import React, { useState } from "react";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import { Input, Radio, Form, Button } from "antd";
import { getProject } from "../../../actions/project";
import {
  createOrganization,
  getOrgByName,
} from "../../../actions/organization";
import ChallengeLogo from "../../../assets/icon/challenge.png";
import { BigUpload } from "../../../components/template";
import { org_consts } from "../../../constants";
import { processLink } from "../../../utils/helper";

export const OrgRegisterForm = ({ onSubmit, org_name }) => {
  const [avatarURL, setAvatar] = useState("");
  const onFinish = (values) => {
    values.logo = avatarURL;
    values.profile = org_consts;
    values.social = processLink(values.social);
    values.org_name = values.org_name.trim()
    onSubmit(values);
  };

  return (
    <Form name="register" onFinish={onFinish} initialValues={{ org_name }}>
      <div className="home-invite-form">
        <Row className="mb-4">
          <Col md={6}>
            <span className="form-label">Name*</span>
            <Form.Item
              name="org_name"
              rules={[
                {
                  required: true,
                  message: "Please input organization name!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <span className="form-label">Web address*</span>
            <Form.Item
              name="social"
              rules={[
                {
                  required: true,
                  message: "Please input organization web address!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col md={6} className="pt-2 center">
            <BigUpload setAvatar={setAvatar} imageUrl={avatarURL} />
          </Col>
        </Row>
      </div>
      <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
        <Button type="ghost" htmlType="submit" className="black-btn wide">
          Continue
        </Button>
      </div>
    </Form>
  );
};

class ProjectRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exorg: true,
      curOrg: null,
    };
  }

  componentDidMount = async () => {
    const { auth, getProject, getOrgByName } = this.props;
    if (auth.pdfData.project_id) {
      await getProject(auth.pdfData.project_id);
    }
    const org = await getOrgByName(auth.pdfData.organization);
    if (org) this.setState({ curOrg: org });
  };

  onGoNext = async (values) => {
    const { auth, user, goBack, createOrganization } = this.props;
    values.creator = user._id;
    values.project = auth.pdfData.project_id;
    await createOrganization(values);
    goBack();
  };

  onChangeEx = (e) => {
    this.setState({ exorg: e.target.value });
  };

  renderCurOrg = (curOrg) => (
    <React.Fragment>
      <div className="org-invite-form">
        <Row>
          <Col md={8}>
            <h5 className="mb-4">
              <b>{curOrg.org_name}</b>
            </h5>
            <p className="mb-5">{curOrg.bio}</p>
            <p>
              <b>Type:</b> <span>{curOrg.org_type}</span>
            </p>
            <p>
              <b>Headquarters:</b> <span>{curOrg.location || ""}</span>
            </p>
            <p>
              <b>Website:</b> <span>{curOrg.social || ""}</span>
            </p>
            <p>
              <b>Linkedin:</b> <span>{curOrg.linkedin || ""}</span>
            </p>
            <p>
              <b>Admin:</b>{" "}
              <span>
                {curOrg.creator.profile.first_name}{" "}
                {curOrg.creator.profile.last_name}
              </span>
            </p>
          </Col>
          <Col md={4}>
            <div className="center">
              <img
                src={curOrg.logo || ChallengeLogo}
                alt=""
                style={{ width: "200px" }}
              />
            </div>
          </Col>
        </Row>
      </div>
      <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
        <Button
          type="ghost"
          onClick={this.props.goBack}
          className="black-btn wide"
        >
          Continue
        </Button>
      </div>
    </React.Fragment>
  );

  render() {
    const { curOrg, exorg } = this.state;

    return (
      <Row>
        <Col md={4}>
          <span>
            <b>STEP 3 of 3</b>
          </span>
          <div className="main-home-title mt-2 mb-4">
            Define your organization
          </div>
          <p className="mt-4 mb-4">
            We try to identify your organization automatically. If this does not
            happen, then you can create an organization yourself.
          </p>
        </Col>
        <Col md={8}>
          {curOrg && (
            <div className="home-invite-form mb-4">
              <Radio.Group
                onChange={this.onChangeEx}
                value={exorg}
                className="org-invite-radiobox"
              >
                <Radio value={true}>
                  <p>
                    <b>I represent {curOrg.org_name}</b>
                  </p>
                  <span>
                    We automatically determined this based on your email
                  </span>
                </Radio>
                <Radio value={false}>
                  <p>
                    <b>I represent other organization</b>
                  </p>
                  <span>Complete your organization details</span>
                </Radio>
              </Radio.Group>
            </div>
          )}
          {curOrg && exorg && this.renderCurOrg(curOrg)}
          {(!curOrg || !exorg) && (
            <OrgRegisterForm
              onSubmit={this.onGoNext}
              org_name={curOrg ? "" : this.props.auth.pdfData.organization}
            />
          )}
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
    project: state.project,
    auth: state.auth,
    user: state.user.profile,
  };
}

export default connect(mapStateToProps, {
  getProject,
  createOrganization,
  getOrgByName,
})(ProjectRegister);
