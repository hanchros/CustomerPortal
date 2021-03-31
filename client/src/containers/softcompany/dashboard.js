import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { Avatar, Skeleton, Tabs, List, Button, Modal } from "antd";
import { Header, Footer } from "../../components/template";
import OrgLogo from "../../assets/icon/challenge.png";
import { listOrgProjects } from "../../actions/organization";
import { protectedTest } from "../../actions/auth";
import history from "../../history";
import BuildLogo from "../../assets/icon/display.svg";
import NonList from "../../components/pages/non-list";
import CompanyTechs from "./company-tech";
import {
  listPCByCompany,
  resolveProjectCompany,
} from "../../actions/softcompany";
import moment from "moment";
import PlatesImg from "../../assets/icon/plates.svg";

const { TabPane } = Tabs;

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      show_detail: false,
      title: "",
      curPC: {},
      showPCModal: false,
    };
  }

  componentDidMount = async () => {
    const { user, protectedTest, listPCByCompany } = this.props;
    this.setState({ loading: true });
    if (!user._id) await protectedTest();
    else await listPCByCompany(user._id);
    this.setState({ loading: false });
  };

  goToProject = (item) => {
    history.push(`/project/${item._id}`);
  };

  onToggleDetail = () => {
    this.setState({ show_detail: !this.state.show_detail });
  };

  renderTitleItem = (title) => (
    <List.Item
      onClick={() => this.setState({ title })}
      className={this.state.title === title && "active"}
    >
      <span>{title}</span>
    </List.Item>
  );

  onOpenInvite = (pc) => {
    this.setState({ curPC: pc, showPCModal: true });
  };

  onHideInvite = () => {
    this.setState({ curPC: {}, showPCModal: false });
  };

  onResolveInvite = async (resolve) => {
    const { user, listPCByCompany, resolveProjectCompany } = this.props;
    await resolveProjectCompany(this.state.curPC._id, resolve);
    await listPCByCompany(user._id);
    this.onHideInvite();
  };

  renderServices = () => {
    const { user } = this.props;
    const { title } = this.state;
    const services = user.profile.services;
    let titles = [],
      items = [];
    for (let sv of services) {
      if (sv.items.length > 0) titles.push(sv.title);
      if (sv.title === title) items = sv.items;
    }
    return (
      <Row>
        <Col md={4}>
          <List
            size="large"
            dataSource={titles}
            className="techhub-title-list"
            renderItem={this.renderTitleItem}
          />
        </Col>
        <Col md={8}>
          <div className="account-form-box mb-3" style={{ minHeight: "40vh" }}>
            {items.map((item) => (
              <h5 key={item} className="mb-4">
                <b>{item}</b>
              </h5>
            ))}
          </div>
        </Col>
      </Row>
    );
  };

  renderProjects = () => {
    const projectcompanies = this.props.softcompany.projectcompanies;
    let pcs = projectcompanies.filter((pc) => pc.status === 0);
    return (
      <React.Fragment>
        <Row>
          <Col>
            <div className="projects-table-header">
              <span />
              <span>name</span>
              <span>organization</span>
              <span>leader</span>
              <span></span>
            </div>
            {pcs.length === 0 && <NonList title="You have no projects yet." />}
            {pcs.map((pc) => (
              <div
                className="project-table-item"
                key={pc._id}
                onClick={() => this.goToProject(pc.project)}
              >
                <div className="cell0">
                  <Avatar src={pc.project.logo || OrgLogo} />
                </div>
                <div className="cell0">
                  <p>
                    <b>{pc.project.name}</b>
                  </p>
                  <span>{pc.project.objective}</span>
                </div>
                <div className="cell0">
                  {pc.project.participant.profile.org_name}
                </div>
                <div className="cell0">
                  {pc.project.participant.profile.first_name}{" "}
                  {pc.project.participant.profile.last_name}
                </div>
                <div className="cell0"></div>
              </div>
            ))}
          </Col>
        </Row>
      </React.Fragment>
    );
  };

  renderInvites = () => {
    const { curPC, showPCModal } = this.state;
    const projectcompanies = this.props.softcompany.projectcompanies;
    let pcs = projectcompanies.filter((pc) => pc.status === 1);
    for (let i = 0; i < pcs.length; i++) {
      let ago = moment(pcs[i].createdAt).fromNow();
      ago = ago.replace(" ago", "");
      pcs[i].ago = ago;
    }

    return (
      <Row>
        <Col>
          <div className="projects-table-header">
            <span />
            <span>Project</span>
            <span>Technology</span>
            <span>Waiting Time</span>
          </div>
          {pcs.length === 0 && <NonList title="You have no invites yet." />}
          {pcs.map((pc) => (
            <div
              className="project-table-item"
              key={pc._id}
              onClick={() => this.onOpenInvite(pc)}
            >
              <div className="cell0">
                <Avatar src={pc.project.logo || OrgLogo} />
              </div>
              <div className="cell0">
                <p>
                  <b>{pc.project.name}</b>
                </p>
                <span>{pc.project.objective}</span>
              </div>
              <div className="cell0">{pc.technology.title}</div>
              <div className="cell0">{pc.ago}</div>
            </div>
          ))}
          {showPCModal && (
            <Modal
              title={"Invitation of Applciation to Project"}
              visible={showPCModal}
              width={900}
              footer={false}
              onCancel={this.onHideInvite}
            >
              <div className="project-info-box">
                <div className="project-detail-head">
                  <div className="pt-1">
                    <img src={PlatesImg} alt="" />
                  </div>
                  <div style={{ width: "100%" }}>
                    <div className="flex mb-5" style={{ alignItems: "center" }}>
                      <h3>{curPC.project.name}</h3>
                    </div>
                    <p>{curPC.project.objective}</p>
                    <Row style={{ maxWidth: "500px" }} className="mb-4">
                      <Col md={6}>
                        <div className="form-label mb-2 mt-2">Organization</div>
                        <span>
                          {curPC.project.participant
                            ? curPC.project.participant.profile.org_name
                            : ""}
                        </span>
                      </Col>
                      <Col md={6}>
                        <div className="form-label mb-2 mt-2">Leader</div>
                        <span>
                          {curPC.project.participant
                            ? `${curPC.project.participant.profile.first_name} ${curPC.project.participant.profile.last_name}`
                            : ""}
                        </span>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="project-img-box">
                  <img src={curPC.project.logo || OrgLogo} alt="" />
                </div>
              </div>
              <div className="flex" style={{ justifyContent: "flex-end" }}>
                <Button
                  type="ghost"
                  className="ghost-btn"
                  onClick={() => this.onResolveInvite("decline")}
                >
                  decline
                </Button>
                <Button
                  type="ghost"
                  className="black-btn ml-3"
                  onClick={() => this.onResolveInvite("accept")}
                >
                  Accept
                </Button>
              </div>
            </Modal>
          )}
        </Col>
      </Row>
    );
  };

  renderCompanyInfo = () => {
    const { show_detail, loading } = this.state;
    const { user } = this.props;
    const profile = user.profile;
    if (loading || !profile) return null;

    return (
      <div className="project-info-box">
        <div className="project-detail-head">
          <div className="pt-1">
            <img src={BuildLogo} alt="" />
          </div>
          <div style={{ width: "100%" }}>
            <div className="flex mb-5" style={{ alignItems: "center" }}>
              <h3>{profile.org_name}</h3>
            </div>
            <p>{profile.description || ""}</p>
            {show_detail && (
              <Row style={{ maxWidth: "700px" }} className="mb-4">
                <Col md={6}>
                  <div className="form-label mb-1 mt-4">Type</div>
                  <span>{profile.org_type}</span>
                  <div className="form-label mb-1 mt-4">Phone</div>
                  <span>{profile.phone}</span>
                  <div className="form-label mb-1 mt-4">Service</div>
                  <span>{profile.main_service}</span>
                  <div className="form-label mb-1 mt-4">Website</div>
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.website}
                    </a>
                  )}
                </Col>
                <Col md={6}>
                  <div className="form-label mb-1 mt-4">Contact</div>
                  <span>{profile.contact || ""}</span>
                  <div className="form-label mb-1 mt-4">Address</div>
                  <span>{profile.address || ""}</span>
                </Col>
              </Row>
            )}
            <Link
              className="text-underline"
              to="#"
              onClick={this.onToggleDetail}
            >
              {show_detail ? "Less" : "More"} details
            </Link>
          </div>
        </div>
        <div className="project-img-box">
          <img src={profile.logo || OrgLogo} alt="" />
        </div>
      </div>
    );
  };

  render() {
    const { user } = this.props;
    const { loading } = this.state;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          {this.renderCompanyInfo()}
          {!loading && user.profile && (
            <Tabs
              defaultActiveKey="1"
              type="card"
              size="large"
              className="custom-tabs"
            >
              <TabPane tab="SERVICES" key="1">
                {this.renderServices()}
              </TabPane>
              <TabPane tab="PROJECTS" key="2">
                {this.renderProjects()}
              </TabPane>
              <TabPane tab="INVITATIONS" key="3">
                {this.renderInvites()}
              </TabPane>
              <TabPane tab="APPLICATIONS" key="4">
                <CompanyTechs />
              </TabPane>
            </Tabs>
          )}
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    projects: state.user.projects,
    softcompany: state.softcompany,
  };
}

export default connect(mapStateToProps, {
  listOrgProjects,
  protectedTest,
  listPCByCompany,
  resolveProjectCompany,
})(Dashboard);
