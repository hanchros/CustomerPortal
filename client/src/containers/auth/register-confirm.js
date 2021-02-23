import React, { Component } from "react";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";
import InviteRequest from "../home/invite/request-invite";
import history from "../../history";

class RegisterConfirm extends Component {
  state = {
    has_invitation: false,
    email: "",
  };

  onClickHas = () => {
    this.setState({ has_invitation: true });
  };

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  onSubmitInvEmail = () => {
    const { email } = this.state;
    if (!email) return;
    console.log(email);
  };

  goNext = () => {
    history.push("/");
  };

  renderInvConfirm = () => (
    <React.Fragment>
      <div className="main-background-title">REGISTRATION</div>
      <p className="mt-5">
        Did you receive e-mail invitation to join a platform?​
      </p>
      <div className="register-btn-group">
        <Link to="#" className="main-btn" onClick={this.onClickHas}>
          Yes
        </Link>
      </div>
      <Link className="resend-intro" to="/invitation">
        <p>What is "an invitation"?</p>
      </Link>
    </React.Fragment>
  );

  render() {
    const { has_invitation } = this.state;
    return (
      <HomeHOC>
        {has_invitation && this.renderInvConfirm()}
        {!has_invitation && <InviteRequest goNext={this.goNext} />}
      </HomeHOC>
    );
  }
}

export default RegisterConfirm;
