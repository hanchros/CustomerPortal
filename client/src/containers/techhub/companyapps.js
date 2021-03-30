import React from "react";
import { connect } from "react-redux";
import { List } from "antd";
import { Row, Col } from "reactstrap";
import Avatar from "antd/lib/avatar/avatar";
import { listTechnology } from "../../actions/technology";

class CompanyApps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      curTech: {},
    };
  }

  componentDidMount = async () => {
    const { listTechnology, user, technology } = this.props;
    if (user._id) {
      await listTechnology(user._id);
    }
    const techs = technology.technologies;
    if (techs.length > 0) {
      this.setState({ curTech: techs[0] });
    }
  };

  onSelectTitle = (tech) => {
    this.setState({ curTech: tech });
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
        <h3 className="mb-3">
          <b>{tech.title}</b>
        </h3>
        <div dangerouslySetInnerHTML={{ __html: tech.content }} />
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

export default connect(mapStateToProps, { listTechnology })(CompanyApps);
