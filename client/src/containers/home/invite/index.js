import React from "react";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import { message, Button, Modal } from "antd";
import HomeHOC from "../../../components/template/home-hoc";
import { FileDrop } from "react-file-drop";
import { ModalSpinner } from "../../../components/pages/spinner";
import { dropRegFile } from "../../../actions/auth";
import RequestInvite from "./request-invite";
import InviteRegister from "./invite-register";
import ProjectRegister from "./project-register";
import InviteComplete from "./invite-complete";
import { getOrgByName } from "../../../actions/organization";
import ChallengeIcon from "../../../assets/icon/challenge.png";
import UploadIcon from "../../../assets/icon/upload.svg";
import CryptFileIcon from "../../../assets/icon/crypted_file.svg";

class InviteHomePage extends React.Component {
  constructor() {
    super();

    this.state = {
      step: 0,
      pdfData: {},
      fileReading: false,
      showConfModal: false,
    };
  }

  componentDidMount = async () => {
    const { match, getOrgByName, orgSettings } = this.props;
    let org_name = match.params.org_name;
    if (org_name && orgSettings.org_name !== org_name) {
      await getOrgByName(org_name);
    }
  };

  onBegin = () => {
    this.setState({ step: 1 });
  };

  onRequestInvite = () => {
    this.setState({ step: 2 });
  };

  onRegisterProject = () => {
    this.setState({ step: 4 });
  };

  onCompleteInvite = () => {
    this.setState({ step: 5 });
  };

  handleDropFile = async (files, e) => {
    if (!files || files.length === 0) return;
    this.setState({ fileReading: true });
    const res = await this.props.dropRegFile(files[0]);
    if (!res.data.result) {
      message.error("Invalid file format!");
      this.setState({ fileReading: false });
      return;
    }
    this.setState({
      pdfData: res.data.result,
      fileReading: false,
      showConfModal: true,
    });
  };

  onSelectFile = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    this.setState({ fileReading: true });
    const res = await this.props.dropRegFile(files[0]);
    if (!res.data.result) {
      message.error("Invalid file format!");
      this.setState({ fileReading: false });
      return;
    }
    this.setState({
      pdfData: res.data.result,
      fileReading: false,
      showConfModal: true,
    });
  };

  onConfirm = () => {
    this.setState({ step: 3, showConfModal: false });
  };

  renderHome = () => {
    const { orgSettings, location } = this.props;
    const params = new URLSearchParams(location.search);
    return (
      <div className="invite-home">
        <img
          className="invite-page-logo"
          src={orgSettings.logo || ChallengeIcon}
          alt=""
        />
        <div className="main-background-title">
          Welcome to the Collaboration App 
        </div>
        <div className="home-intro">
          {orgSettings.org_name} has invited you to join the{" "}
          {params.get("project")} project.
        </div>
        <span className="home-span">
          Join to project and find out more information
        </span>
        <Button
          type="ghost"
          className="black-btn mt-5"
          onClick={this.onBegin}
        >
          start registration
        </Button>
      </div>
    );
  };

  renderRegisterStart = () => (
    <Row className="pdf-home">
      <Col md={3}>
        <span>
          <b>STEP 1 of 3</b>
        </span>
        <div className="main-home-title mt-2 mb-4">
          Provide your PDF invitation
        </div>
        <p className="mt-4 mb-4">
          Please check your email of an invitation letter. PDF file with
          invitation should be attached there.
        </p>
        <hr />
        <p className="mt-4">
          <b>Didn’t get an invitation with PDF file?​​</b>
        </p>
        <Button
          type="ghost"
          className="ghost-btn mb-4"
          onClick={this.onRequestInvite}
        >
          Request an invitation​
        </Button>
        <ModalSpinner visible={this.state.fileReading} />
        <Modal
          visible={this.state.showConfModal}
          width={400}
          footer={false}
          centered
        >
          <div className="confirm-file-read">
            <img src={CryptFileIcon} alt="" />
            <p>
              You have just experienced blockchain "smart document" technology
            </p>
            <span>
              This technology that allows ordinary documents to processed
              automatically by almost any software
            </span>
            <Button
              type="ghost"
              className="black-btn mt-5"
              onClick={this.onConfirm}
            >
              continue
            </Button>
          </div>
        </Modal>
      </Col>
      <Col md={9} className="mb-4">
        <FileDrop onDrop={this.handleDropFile}>
          <div className="invite-file-zone">
            <img src={UploadIcon} alt="" className="mb-4" />
            <span>
              <b>Drag and drop PDF invitation here</b>
            </span>
            <span>
              <b>
                or <label htmlFor="file_input_id"> choose file manually</label>
                <input
                  type="file"
                  id="file_input_id"
                  accept="application/pdf"
                  onChange={this.onSelectFile}
                ></input>
              </b>
            </span>
          </div>
        </FileDrop>
      </Col>
    </Row>
  );

  render() {
    const { step, pdfData } = this.state;
    const { orgSettings } = this.props;

    return (
      <HomeHOC logo={orgSettings.logo} org_name={orgSettings.org_name}>
        {step === 0 && this.renderHome()}
        {step === 1 && this.renderRegisterStart()}
        {step === 2 && <RequestInvite goNext={this.onBegin} />}
        {step === 3 && (
          <InviteRegister
            goNext={this.onRegisterProject}
            pdfData={pdfData}
            goBack={this.onBegin}
          />
        )}
        {step === 4 && <ProjectRegister goBack={this.onCompleteInvite} />}
        {step === 5 && <InviteComplete />}
      </HomeHOC>
    );
  }
}

function mapStateToProps(state) {
  return {
    orgSettings: state.organization.orgSettings,
  };
}

export default connect(mapStateToProps, { dropRegFile, getOrgByName })(
  InviteHomePage
);
