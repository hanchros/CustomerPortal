import React from "react";
import { connect } from "react-redux";
import { resendVerification } from "../../actions/auth";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";

class Resend extends React.Component {
  render() {
    return (
      <HomeHOC>
        <div className="flex-colume-center">
          <div className="main-background-title">REGISTRATION</div>
          <p className="resend-desc">
            To continue please check your inbox and confirm your email.​
          </p>
          <p className="resend-intro">
            Did not get an anything? Check your spam folder or{" "}
            <Link
              className="verify-link"
              to="#"
              onClick={this.props.resendVerification}
            >
              request another one
            </Link>
          </p>
        </div>
      </HomeHOC>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
  };
}

export default connect(mapStateToProps, { resendVerification })(Resend);
