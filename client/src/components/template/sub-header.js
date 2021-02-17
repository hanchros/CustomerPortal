import React from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import { LeftOutlined } from "@ant-design/icons";

const SubHeader = ({ org_name, project }) => (
  <div className="sub-header">
    <Container>
      {project && (
        <div className="sub-link">
          <Link to={`/${org_name}/projects`}>Projects</Link>
          <LeftOutlined />
          <Link to={`/${org_name}/project/${project._id}`}>{project.name}</Link>
        </div>
      )}
    </Container>
  </div>
);

export default SubHeader;
