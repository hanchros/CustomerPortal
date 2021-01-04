import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class ProjectRegister extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="main-background-title">REGISTRATION</div>
        <h5 className="mt-5">This is project registration page</h5>
        <div className="home-btn-group mt-big">
          <Link to="#" className="main-btn" onClick={this.props.goBack}>
            Back
          </Link>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {})(ProjectRegister);
