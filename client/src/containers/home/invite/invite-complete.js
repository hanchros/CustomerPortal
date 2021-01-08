import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ChallengeLogo from "../../../assets/icon/challenge.png";

class InviteComplete extends React.Component {
  render() {
    const { project } = this.props;
    const curProj = project.project;
    return (
      <React.Fragment>
        <div className="main-background-title">REGISTERATION</div>
        <div className="project-box">
          <div className="register-project-view">
            <div>
              <img src={curProj.logo || ChallengeLogo} alt="" />
            </div>
            <div>
              <p>
                <b>{curProj.name}</b>
              </p>
              <span>{curProj.description}</span>
            </div>
          </div>
          <p className="mt-big">
            You are the member of project "{curProj.name}"!
          </p>
          <p>You can start your contribution after login</p>
          <p className="mt-5">
            More explanation of the nature of a project – team members,
            technical, business, etc.
          </p>
        </div>
        <div className="home-btn-group mt-big">
          <Link to="/" className="main-btn">
            Home
          </Link>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    project: state.project,
  };
}

export default connect(mapStateToProps, {})(InviteComplete);
