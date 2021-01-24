import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { updateFieldData } from "../../../actions/profile";

class SiteSetting extends React.Component {
  render() {
    return (
      <div className="container">
        <Row>
          <Col className="flex">
            <h5 className="mr-auto">Site Setting</h5>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col md={6}>
            <p>
              <span>Here is site setting options</span>
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fieldData: state.profile.fieldData };
}

export default connect(mapStateToProps, {
  updateFieldData,
})(SiteSetting);
