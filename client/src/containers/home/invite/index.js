import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";
import { message, Modal } from "antd";
import HomeHOC from "../../../components/template/home-hoc";
import { FileDrop } from "react-file-drop";
import { dropRegFile } from "../../../actions/auth";
import RequestInvite from "./request-invite";
import InviteRegister from "./invite-register";
import ProjectRegister from "./project-register";

class InviteHomePage extends React.Component {
  constructor() {
    super();

    this.state = {
      step: 0,
      pdfData: {},
      fileReading: false,
    };
  }

  onBegin = () => {
    this.setState({ step: 1 });
  };

  onRequestInvite = () => {
    this.setState({ step: 2 });
  };

  onRegisterProject = () => {
    this.setState({ step: 4 });
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
    this.setState({ step: 3, pdfData: res.data.result, fileReading: false });
  };

  renderHome = () => (
    <React.Fragment>
      <div className="main-background-title">INTEGRA SPACE</div>
      <p className="home-intro mt-big">
        Explanation – address all friction and fears​
      </p>
      <div className="home-btn-group mt-big">
        <Link to="#" className="main-btn" onClick={this.onBegin}>
          Begin
        </Link>
      </div>
    </React.Fragment>
  );

  renderRegisterStart = () => (
    <React.Fragment>
      <div className="main-background-title mb-5">REGISTRATION</div>
      <FileDrop onDrop={this.handleDropFile}>
        <div className="invite-file-zone">
          <p>Did you receive an invitation?</p>
          <p>Drag and drop it here​</p>
        </div>
      </FileDrop>

      <div className="mt-big" style={{ textAlign: "center" }}>
        <p>Didn’t get an invitation?​​</p>
        <Link to="#" className="main-btn" onClick={this.onRequestInvite}>
          Request an invitation​
        </Link>
      </div>
      <Modal
        title={null}
        visible={this.state.fileReading}
        width={300}
        footer={false}
        closable={false}
        centered
        className={"fileread-modal transparent"}
      >
        <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
      </Modal>
    </React.Fragment>
  );

  render() {
    const { step, pdfData } = this.state;
    return (
      <HomeHOC>
        {step === 0 && this.renderHome()}
        {step === 1 && this.renderRegisterStart()}
        {step === 2 && <RequestInvite goNext={this.onBegin} />}
        {step === 3 && (
          <InviteRegister goNext={this.onRegisterProject} pdfData={pdfData} />
        )}
        {step === 4 && <ProjectRegister goBack={this.onBegin} />}
      </HomeHOC>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { dropRegFile })(InviteHomePage);
