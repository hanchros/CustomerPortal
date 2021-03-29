import React from "react";
import { Button } from "antd";
import CongratImg from "../../../../assets/icon/congrat.svg";
import history from "../../../../history";

class CompanyComplete extends React.Component {
  onGoStart = () => {
    history.push("/login");
  };

  render() {
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
          <span>You are the part of the Collaboration.App</span>
          <Button
            type="ghost"
            className="black-btn wide mt-5 mb-3 mr-auto ml-auto"
            onClick={this.onGoStart}
          >
            What's next?
          </Button>
        </div>
      </div>
    );
  }
}

export default CompanyComplete;
