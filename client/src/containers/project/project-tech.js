import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import TechImg from "../../assets/img/technology.png";

class ProjectTech extends Component {
  render = () => {
    const { project, goback } = this.props;
    const curProj = project.project;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Button className="mb-4" type="link" onClick={goback}>
            <ArrowLeftOutlined /> Back
          </Button>
          <h4 className="mb-5">{curProj.name} Technology</h4>
          <span>
            To add or remove technology from this project use "Edit" function on
            the project's main page
          </span>
          <p className="mb-4" />
          {curProj.technologies &&
            curProj.technologies.map((tech, index) => (
              <div className="project-general-box mb-4" key={index}>
                <div className="pr-4">
                  <img src={tech.icon || TechImg} alt="" />
                </div>
                <div>
                  <h5 className="mt-2">{tech.title}</h5>
                  <div dangerouslySetInnerHTML={{ __html: tech.content }} />
                </div>
              </div>
            ))}
        </Container>
        <Footer />
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    project: state.project,
  };
};

export default connect(mapStateToProps, {})(ProjectTech);
