import React from "react";
import { connect } from "react-redux";
import { Button, List, Select, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Row, Col } from "reactstrap";
import Avatar from "antd/lib/avatar/avatar";
import { listAllTechnology } from "../../actions/technology";
import { listProjectByCreator } from "../../actions/project";
import { inviteProjectCompany } from "../../actions/softcompany";

class CompanyAllApps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      curTech: {},
      visible: false,
      projects: [],
      curProjId: "",
    };
  }

  componentDidMount = async () => {
    const {
      listAllTechnology,
      listProjectByCreator,
      technology,
      user,
    } = this.props;
    await listAllTechnology();
    let projects = await listProjectByCreator(user._id);
    const techs = technology.technologies;
    this.setState({ projects, curTech: techs.length > 0 ? techs[0] : {} });
  };

  onSelectTitle = (tech) => {
    this.setState({ curTech: tech });
  };

  onToggleModal = () => {
    this.setState({ visible: !this.state.visible });
  };

  onChangeProj = (value) => {
    this.setState({ curProjId: value });
  };

  sendInvitePC = async () => {
    const { curTech, curProjId } = this.state;
    const project = curProjId;
    const softcompany = curTech.organization._id;
    const technology = curTech._id;
    if (!project || !softcompany || !technology) return;
    await this.props.inviteProjectCompany({ project, softcompany, technology });
    this.onToggleModal();
  };

  renderTitleItem = (tech) => (
    <List.Item
      onClick={() => this.onSelectTitle(tech)}
      className={this.state.curTech._id === tech._id && "active"}
    >
      <span style={{ width: "80%" }}>{tech.title}</span>
      {tech.logo && <Avatar src={tech.logo} />}
    </List.Item>
  );

  renderTechContent = () => {
    const tech = this.state.curTech;
    if (!tech.title) return null;
    return (
      <React.Fragment>
        <div className="flex mb-3" style={{ justifyContent: "space-between" }}>
          <h3>
            <b>{tech.title}</b>
          </h3>
          <Button
            type="ghost"
            className="black-btn"
            onClick={this.onToggleModal}
          >
            <PlusOutlined />
            invite to project
          </Button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: tech.content }} />
        <div className="form-label mb-1 mt-4">Associated company</div>
        <span>
          {tech.organization ? tech.organization.profile.org_name : ""}
        </span>
        <hr className="mt-4 mb-4" />
        <h5 className="mb-4">
          <b>Offerings</b>
        </h5>
        <div className="form-label mb-1 mt-4">Service</div>
        <span>{tech.service}</span>
        <div className="form-label mb-1 mt-4">Document URL</div>
        {tech.doc_url && (
          <a href={tech.doc_url} target="_blank" rel="noopener noreferrer">
            {tech.doc_url}
          </a>
        )}
        <div className="form-label mb-1 mt-4">API URL</div>
        {tech.api_url && (
          <a href={tech.api_url} target="_blank" rel="noopener noreferrer">
            {tech.api_url}
          </a>
        )}
        <div className="form-label mb-1 mt-4">Example URL</div>
        {tech.example_url && (
          <a href={tech.example_url} target="_blank" rel="noopener noreferrer">
            {tech.example_url}
          </a>
        )}
        <div className="form-label mb-1 mt-4">Landing Page URL</div>
        {tech.landing_url && (
          <a href={tech.landing_url} target="_blank" rel="noopener noreferrer">
            {tech.landing_url}
          </a>
        )}
      </React.Fragment>
    );
  };

  render() {
    const techs = this.props.technology.technologies;
    const { visible, projects } = this.state;
    return (
      <Row>
        <Col md={4} sm={12}>
          <List
            size="large"
            dataSource={techs}
            className="techhub-title-list"
            renderItem={this.renderTitleItem}
          />
        </Col>
        <Col md={8} sm={12}>
          <div className="account-form-box" style={{ minHeight: "50vh" }}>
            {this.renderTechContent()}
          </div>
          {visible && (
            <Modal
              visible={visible}
              width={500}
              footer={false}
              onCancel={this.onToggleModal}
            >
              <div className="modal-invite-pc">
                <h2 className="center mt-4 mb-5">
                  <b>Invite Software Organization</b>
                </h2>
                <span className="form-label">Choose a project</span>
                <br />
                <Select
                  size="large"
                  onChange={this.onChangeProj}
                  style={{ width: "100%" }}
                  placeholder="Project name"
                >
                  {projects.map((item) => {
                    return (
                      <Select.Option key={item._id} value={item._id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
                <Button
                  type="ghost"
                  className="black-btn wide mt-5"
                  onClick={this.sendInvitePC}
                  style={{ width: "100%" }}
                >
                  invite to the project
                </Button>
                <Button
                  type="ghost"
                  className="ghost-btn wide mt-3"
                  onClick={this.onToggleModal}
                  style={{ width: "100%" }}
                >
                  cancel
                </Button>
              </div>
            </Modal>
          )}
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    technology: state.technology,
  };
}

export default connect(mapStateToProps, {
  listAllTechnology,
  listProjectByCreator,
  inviteProjectCompany,
})(CompanyAllApps);
