import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { confirmEmail } from "../../actions/auth";
import HomeHOC from "../../components/template/home-hoc";

class ConfirmEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      message: "",
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    let message = await this.props.confirmEmail({
      token: this.props.match.params.token,
      mode: this.props.match.params.mode,
    });
    this.setState({ message, loading: false });
  };

  render() {
    const { loading, message } = this.state;
    return (
      <HomeHOC>
        <div className="flex-colume-center">
          <div className="main-background-title">Email Confirmation</div>
          <p className="mt-5" />
          {loading && <h5>Verifing your accout ...</h5>}
          {!loading && <h5>{message}</h5>}
          {!loading && (
            <div className="verify-redirect">
              <Link className="main-btn" to={"/login"}>
                LogIn
              </Link>
            </div>
          )}
        </div>
      </HomeHOC>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps, { confirmEmail })(ConfirmEmail);
