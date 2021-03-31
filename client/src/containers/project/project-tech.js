import React, { Component } from "react";
import { connect } from "react-redux";
import { Avatar, Button, Modal } from "antd";
import TechImg from "../../assets/img/technology.png";
import NonList from "../../components/pages/non-list";
import Technology from "../template/technology";
import history from "../../history";
import { updateProjectTechs } from "../../actions/project";

class ProjectTech extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleTech: false,
      technologies: [],
      visibleDetail: false,
      curTech: null,
    };
  }

  componentDidMount = () => {
    const curProj = this.props.project.project;
    this.setTechnologies(curProj.technologies || []);
  };

  onToggleTechModal = () => {
    this.setState({ visibleTech: !this.state.visibleTech });
  };

  onGotoTech = (item) => {
    if (!item.organization) {
      history.push(`/techhub?tab=3&id=${item._id}`);
    } else if (
      item.organization === this.props.organization.currentOrganization._id
    ) {
      history.push(`/techhub?tab=5&id=${item._id}`);
    } else {
      this.setState({ visibleDetail: true, curTech: item });
    }
  };

  onHideDetails = () => {
    this.setState({ visibleDetail: false, curTech: null });
  };

  setTechnologies = (technologies) => {
    this.setState({ technologies });
  };

  updateTechs = async () => {
    const { project, updateProjectTechs } = this.props;
    await updateProjectTechs(project.project._id, this.state.technologies);
    this.onToggleTechModal();
  };

  render = () => {
    const { project, isCreator } = this.props;
    const { visibleTech, technologies, visibleDetail, curTech } = this.state;
    const curProj = project.project;

    return (
      <React.Fragment>
        {isCreator && (
          <div className="tech-btns">
            <Button
              type="ghost"
              className="ghost-btn"
              onClick={this.onToggleTechModal}
            >
              Add technology
            </Button>
          </div>
        )}
        {curProj.technologies && curProj.technologies.length === 0 && (
          <NonList
            title="You have no technologies yet"
            description="Use buttons above to add technologies."
          />
        )}
        {curProj.technologies && curProj.technologies.length > 0 && (
          <ul className="project-tech-items">
            {curProj.technologies.map((item) => (
              <li key={item._id} onClick={() => this.onGotoTech(item)}>
                <Avatar src={item.icon || TechImg} />
                <b>{item.title}</b>
              </li>
            ))}
          </ul>
        )}
        {visibleTech && (
          <Modal
            title="Project Technology"
            visible={visibleTech}
            width={800}
            footer={false}
            onCancel={this.onToggleTechModal}
          >
            <Technology
              technologies={technologies}
              onChangeTechs={this.setTechnologies}
            />
            <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
              <Button
                type="ghost"
                onClick={this.onToggleTechModal}
                className="ghost-btn"
              >
                Cancel
              </Button>
              <Button
                type="ghost"
                className="black-btn ml-3"
                onClick={this.updateTechs}
              >
                Submit
              </Button>
            </div>
          </Modal>
        )}
        {visibleDetail && (
          <Modal
            title="Project Technology"
            visible={visibleDetail}
            width={500}
            footer={false}
            onCancel={this.onHideDetails}
            centered
          >
            <div className="flex-colume-center">
              <img src={curTech.icon || TechImg} alt="" height={70} />
              <h5 className="mt-4 mb-4">
                <b>{curTech.title}</b>
              </h5>
              <div dangerouslySetInnerHTML={{ __html: curTech.content }} />
              <Button
                type="ghost"
                className="ghost-btn mt-4"
                onClick={this.onHideDetails}
              >
                close
              </Button>
            </div>
          </Modal>
        )}
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    project: state.project,
    organization: state.organization,
  };
};

export default connect(mapStateToProps, { updateProjectTechs })(ProjectTech);
