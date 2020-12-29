import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Input } from "antd";
import HomeHOC from "../../components/template/home-hoc";

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

  renderInvConfirm = () => (
    <React.Fragment>
      <p className="mt-5">
        Did you receive e-mail invitation to join a platform?​
      </p>
      <div className="register-btn-group">
        <Link to="#" className="main-btn" onClick={this.onClickHas}>
          Yes
        </Link>
        <Link to="/register-form" className="main-btn">
          No
        </Link>
      </div>
      <Link className="resend-intro" to="/invitation">
        <p>What is "an invitation"?</p>
      </Link>
    </React.Fragment>
  );

  render() {
    const { has_invitation, email } = this.state;
    return (
      <HomeHOC>
        <div className="main-background-title">REGISTRATION</div>
        {!has_invitation && this.renderInvConfirm()}
        {has_invitation && (
          <React.Fragment>
            <p className="mt-5">Awesome!</p>
            <div className="send-invite-email">
              <p>
                Please use a link in your invitation to register and join a
                project you were invited in!​
              </p>
              <p className="mt-5">
                Can’t find that e-mail? That’s ok, we can send it again ​
              </p>
              <div className="register-inv-send">
                <Input
                  size="large"
                  type="email"
                  onChange={this.onChangeEmail}
                  value={email}
                  placeholder="E-mail"
                />
                <button className="main-btn" onClick={this.onSubmitInvEmail}>
                  Send
                </button>
              </div>
            </div>
            <p>Still don’t see it? Please check spam folder​</p>
          </React.Fragment>
        )}
      </HomeHOC>
    );
  }
}

export default RegisterConfirm;
