import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Button } from "antd";
import { updateFieldData } from "../../../actions/profile";
import RichTextEditor from "../../../components/pages/editor";
import { getOneFieldData } from "../../../utils/helper";

class SiteSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: getOneFieldData(this.props.fieldData, "dash_intro"),
    };
  }

  onChangeIntro = (value) => {
    this.setState({ value });
  };

  onSaveIntro = () => {
    const { updateFieldData } = this.props;
    updateFieldData({ field: "dash_intro", value: this.state.value });
  };

  render() {
    return (
      <div className="container">
        <Row>
          <Col className="flex">
            <h5 className="mr-auto">Site Setting</h5>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col md={12}>
            <span>Introduce Page Content</span>
            <RichTextEditor
              placeholder="Indroduction"
              onChange={this.onChangeIntro}
              value={this.state.value}
            />
            <Button
              type="primary"
              style={{ float: "right" }}
              className="mt-2 mb-5"
              onClick={this.onSaveIntro}
            >
              Save Intro
            </Button>
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
