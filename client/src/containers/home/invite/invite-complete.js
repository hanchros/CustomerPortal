import React from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import CongratImg from "../../../assets/icon/congrat.svg";
import history from "../../../history";

class InviteComplete extends React.Component {
  onGoStart = () => {
    history.push("/");
  };

  render() {
    const { project } = this.props;
    const curProj = project.project;
    return (
      <div className="flex" style={{ justifyContent: "center" }}>
        <div
          className="home-invite-form mb-4"
          style={{ textAlign: "center", maxWidth: "400px" }}
        >
          <img className="mb-5" src={CongratImg} alt="" />
          <br />
          <h5 className="mb-4">
            <b>Congratulations!</b>
          </h5>
          <span>You are the member of project "{curProj.name}".</span>
          <Button
            type="ghost"
            className="black-btn mt-5 mb-3 mr-auto ml-auto"
            onClick={this.onGoStart}
          >
            how to start?
          </Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    project: state.project,
  };
}

export default connect(mapStateToProps, {})(InviteComplete);
