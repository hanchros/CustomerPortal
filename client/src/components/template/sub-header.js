import React from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import { LeftOutlined } from "@ant-design/icons";

const SubHeader = ({ project }) => (
  <div className="sub-header">
    <Container>
      {project && (
        <div className="sub-link">
          <Link to={`/dashboard`}>Projects</Link>
          <LeftOutlined />
          <Link to={`/project/${project._id}`}>{project.name}</Link>
        </div>
      )}
    </Container>
  </div>
);

export default SubHeader;
