import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { extractContent } from "../../utils/helper";
import TechImg from "../../assets/img/technology.png";

class ProjectTech extends Component {
  render = () => {
    const { project, goback } = this.props;
    // let isCreator =
    //   project.project.participant &&
    //   project.project.participant._id === user._id;
    const curProj = project.project;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Button className="mb-4" type="link" onClick={goback}>
            <ArrowLeftOutlined /> Back
          </Button>
          <h4 className="mb-4">{curProj.name} Technology</h4>
          {curProj.technologies &&
            curProj.technologies.map((tech, index) => (
              <div className="project-general-box mb-4" key={index}>
                <div className="pr-4">
                  <img src={tech.image || TechImg} alt="" />
                </div>
                <div>
                  <h5>{tech.title}</h5>
                  <span>{extractContent(tech.content, true)}</span>
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
    user: state.user.profile,
    isAdmin: state.user.isAdmin,
    auth: state.auth,
    project: state.project,
    fieldData: state.profile.fieldData,
  };
};

export default connect(mapStateToProps, {})(ProjectTech);
