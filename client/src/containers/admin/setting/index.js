import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Switch, Button } from "antd";
import {
  setMentor,
  setSummary,
  updateFieldData,
} from "../../../actions/profile";
import RichTextEditor from "../../../components/pages/editor";
import { updateLabel } from "../../../actions/label";
import LabelForm from "./label";
import { getOneFieldData } from "../../../utils/helper";

class SiteSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      summary: getOneFieldData(this.props.fields.fieldData, "summary"),
    };
  }

  onChangeSummary = (value) => {
    this.setState({ summary: value });
  };

  onChangeMentor = (checked) => {
    this.props.setMentor(checked);
  };

  onChangeShowGallery = (checked) => {
    this.props.updateFieldData({
      field: "show_gallery",
      value: checked ? "true" : "",
    });
  };

  onChangeShowProject = (checked) => {
    this.props.updateFieldData({
      field: "show_project",
      value: checked ? "true" : "",
    });
  };

  onChangeEmailVerification = (checked) => {
    this.props.updateFieldData({
      field: "show_ev",
      value: checked ? "true" : "",
    });
  };

  onSaveSummary = () => {
    const { summary } = this.state;
    if (!summary) return;
    this.props.setSummary(summary);
  };

  render() {
    const { fields, updateLabel, label } = this.props;
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
              <Switch
                className="mr-2"
                defaultChecked={!!getOneFieldData(fields.fieldData, "show_ev")}
                onChange={this.onChangeEmailVerification}
              />
              <span>Email Verification</span>
            </p>
            <p>
              <Switch
                className="mr-2"
                defaultChecked={fields.mentor}
                onChange={this.onChangeMentor}
              />
              <span>Mentor Role</span>
            </p>
          </Col>
          <Col md={6}>
            <p>
              <Switch
                className="mr-2"
                defaultChecked={
                  !!getOneFieldData(fields.fieldData, "show_project")
                }
                onChange={this.onChangeShowProject}
              />
              <span>Show Project</span>
            </p>
            <p>
              <Switch
                className="mr-2"
                defaultChecked={
                  !!getOneFieldData(fields.fieldData, "show_gallery")
                }
                onChange={this.onChangeShowGallery}
              />
              <span>Show Gallery</span>
            </p>
          </Col>
        </Row>
        <br />
        <span>Summary Edit</span>
        <div className="admin-settings-block">
          <RichTextEditor
            placeholder="Summary"
            onChange={this.onChangeSummary}
            value={this.state.summary}
          />
          <Button
            type="primary"
            style={{ float: "right" }}
            className="btn-admin-save"
            onClick={this.onSaveSummary}
          >
            Save Summary
          </Button>
        </div>
        <span>Edit Labels</span>
        <div className="admin-settings-block">
          <LabelForm updateLabel={updateLabel} label={label} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fields: state.profile, label: state.label };
}

export default connect(mapStateToProps, {
  setMentor,
  setSummary,
  updateLabel,
  updateFieldData,
})(SiteSetting);
