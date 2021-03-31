import React, { Component } from "react";
import { connect } from "react-redux";
import { Avatar } from "antd";
import TechImg from "../../assets/img/technology.png";
import NonList from "../../components/pages/non-list";
import { listPCByProject } from "../../actions/softcompany";

class ProjectApps extends Component {
  componentDidMount = () => {
    const curProj = this.props.project.project;
    this.props.listPCByProject(curProj._id);
  };

  render = () => {
    const projectcompanies = this.props.softcompany.projectcompanies;
    let pcs = projectcompanies.filter((pc) => pc.status === 0);

    return (
      <React.Fragment>
        {pcs.length === 0 && <NonList title="You have no applications yet" />}
        {pcs.length > 0 && (
          <ul className="project-tech-items">
            {pcs.map((pc) => (
              <li key={pc._id}>
                <Avatar src={pc.technology.logo || TechImg} />
                <b>
                  {pc.technology.title} - {pc.softcompany.profile.org_name}
                </b>
              </li>
            ))}
          </ul>
        )}
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    project: state.project,
    softcompany: state.softcompany,
  };
};

export default connect(mapStateToProps, { listPCByProject })(ProjectApps);
