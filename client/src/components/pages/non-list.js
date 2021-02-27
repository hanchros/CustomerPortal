import React from "react";
import { FileOutlined } from "@ant-design/icons";

const NonList = ({ title, description }) => (
  <div className="non-list">
    <div className="center">
      <FileOutlined />
      <br />
      <b>{title}</b>
      <br />
      <span>{description}</span>
    </div>
  </div>
);

export default NonList;
