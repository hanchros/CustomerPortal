import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";
import { getOneFieldData } from "../../utils/helper";

class IntegraSpace extends React.Component {
  render() {
    const content = getOneFieldData(this.props.fieldData, "dash_intro");
    return (
      <HomeHOC>
        <div className="flex-colume-center">
          <div className="main-background-title">What is Collaboration App ?</div>
          <div className="mt-5" dangerouslySetInnerHTML={{ __html: content }} />
          <div className="is-btn">
            <Link to="/register" className="main-btn">
              REGISTER
            </Link>
          </div>
        </div>
      </HomeHOC>
    );
  }
}

function mapStateToProps(state) {
  return { fieldData: state.profile.fieldData };
}

export default connect(mapStateToProps, {})(IntegraSpace);
