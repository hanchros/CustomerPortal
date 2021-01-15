import React from "react";
import { Tag } from "antd";
import {
  getTargetFieldName,
  getTargetLabelFromSection,
  randomColor,
} from "../../utils/helper";

class Tags extends React.Component {
  render() {
    const { fieldData, prefix } = this.props;
    const namelist = getTargetFieldName(prefix, fieldData);
    return (
      <span>
        {namelist.map((name, i) => {
          return this.renderTags(name, i);
        })}
      </span>
    );
  }

  renderTags = (name, i) => {
    const { fieldData, tags, prefix, withLavel } = this.props;
    let taglist = [];
    for (let tagId of tags) {
      let filters = fieldData.filter(
        (item) => item._id === tagId && item.field === name
      );
      if (filters.length > 0) taglist.push(filters[0]);
    }
    const label = getTargetLabelFromSection(prefix, name);
    if (taglist.length === 0) return null;
    return (
      <span style={{ marginBottom: "8px" }} key={i}>
        {withLavel && <b>{label}:&nbsp;&nbsp;</b>}
        {taglist.map((tag, index) => (
          <Tag key={tag._id} color={randomColor(index)} className="mr-2">
            {tag.value}
          </Tag>
        ))}
      </span>
    );
  };
}

export default Tags;
