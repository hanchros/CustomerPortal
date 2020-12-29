import React from "react";
import { connect } from "react-redux";
import { Tag } from "antd";
import {
  getTargetFieldName,
  getTargetLabelFromSection,
  randomColor,
  sortByValue,
} from "../../utils/helper";

class UserTags extends React.Component {
  render() {
    const { contact, fieldData } = this.props;
    const namelist = getTargetFieldName("profile", fieldData);
    return (
      <div className="mt-4">
        {namelist.map((name, i) => {
          return this.renderTags(name, randomColor(i), i);
        })}
        {contact && (
          <p>
            <b>Contact:&nbsp;&nbsp;</b>
            <span>{contact}</span>
          </p>
        )}
      </div>
    );
  }

  renderTags = (name, color, i) => {
    const { fieldData, tags } = this.props;
    let taglist = [];
    for (let tagId of tags) {
      let filters = fieldData.filter(
        (item) => item._id === tagId && item.field === name
      );
      if (filters.length > 0) taglist.push(filters[0]);
    }
    const label = getTargetLabelFromSection("profile", name);
    if (taglist.length === 0) return null;
    taglist = sortByValue(taglist);
    return (
      <p style={{ marginBottom: "8px" }} key={i}>
        <b>{label}:&nbsp;&nbsp;</b>
        {taglist.map((tag) => (
          <Tag key={tag._id} color={color} className="mr-2">
            {tag.value}
          </Tag>
        ))}
      </p>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    fieldData: state.profile.fieldData,
  };
};

export default connect(mapStateToProps, {})(UserTags);
