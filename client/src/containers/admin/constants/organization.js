import React from "react";
import { connect } from "react-redux";
import { Input, Button } from "antd";
import ConstSection from "./section";
import {
  getTargetFieldName,
  getTargetLabelFromSection,
  processTargetSectionName,
  randomColor,
} from "../../../utils/helper";
import { deleteFieldData, createFieldData } from "../../../actions/profile";
import ListColumn from "./list-column";
import Intro from "./intro";

class OrgData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      namelist: getTargetFieldName("organization", props.fieldData),
      newsection: "",
    };
  }

  onAddNewSection = () => {
    const { namelist, newsection } = this.state;
    if (!newsection) return;
    namelist.push(processTargetSectionName("organization", newsection));
    this.setState({ namelist, newsection: "" });
  };

  render() {
    const { namelist, newsection } = this.state;
    return (
      <div className="admin-const" tabIndex="-1">
        <h5>Organization constants</h5>
        {namelist.map((name, i) => (
          <ConstSection
            fieldName={name}
            label={getTargetLabelFromSection("organization", name)}
            color={randomColor(i)}
            key={i}
          />
        ))}
        <div className="profile-add-section">
          <Input
            value={newsection}
            onChange={(e) => this.setState({ newsection: e.target.value })}
          />
          <Button type="primary" onClick={this.onAddNewSection}>
            Add New Field
          </Button>
        </div>
        <ListColumn field={"org_column"} />
        <Intro field={"org_intro"} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fieldData: state.profile.fieldData };
}

export default connect(mapStateToProps, { deleteFieldData, createFieldData })(
  OrgData
);
