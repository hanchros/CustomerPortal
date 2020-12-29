import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Header, Footer } from "../../components/template";
import { Skeleton, List, Card, Avatar, Button, Modal, Popconfirm } from "antd";
import { getGallery, privateGallery } from "../../actions/gallery";
import {
  getPublicParticipant,
  getProject,
  contactProjectCreator,
} from "../../actions/project";
import { getOrganization, contactOrg } from "../../actions/organization";
import ContactForm from "../../components/gallery/contact_form";
import ProjectAvatar from "../../assets/icon/challenge.png";
import UserAvatar from "../../assets/img/user-avatar.png";
import Tags from "../../components/pages/tags";
import Video from "../../components/gallery/video";
import {
  FileTextOutlined,
  LinkOutlined,
  TeamOutlined,
  LeftOutlined,
  RightOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Meta } = Card;
const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};

class Gallery extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      numPages: 0,
      pageNumber: 1,
      showModal: false,
      modalType: "",
    };
  }

  componentDidMount = async () => {
    const {
      getGallery,
      getPublicParticipant,
      getProject,
      getOrganization,
      match,
    } = this.props;
    this._isMounted = true;
    this.setState({ loading: true });
    let curGallery = await getGallery(match.params.id);
    await getPublicParticipant(curGallery.project);
    if (!this._isMounted) return;
    this.setState({ loading: false });
    let curProject = await getProject(curGallery.project);
    await getOrganization(curProject.challenge.organization);
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  setPageNumber = (num) => {
    this.setState({ pageNumber: num });
  };

  previousPage = () => {
    const { pageNumber } = this.state;
    if (pageNumber <= 1) return;
    this.setState({ pageNumber: pageNumber - 1 });
  };

  nextPage = () => {
    const { pageNumber, numPages } = this.state;
    if (pageNumber >= numPages) return;
    this.setState({ pageNumber: pageNumber + 1 });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  openProjectContact = () => {
    this.setState({
      modalType: "project",
      showModal: true,
    });
  };

  openOrgContact = () => {
    this.setState({
      modalType: "org",
      showModal: true,
    });
  };

  contactGallery = (values) => {
    const project = this.props.project.project;
    const gallery = this.props.gallery.currentGallery;
    const organization = this.props.organization.currentOrganization;
    const { modalType } = this.state;
    values.gallery = gallery.name;

    if (modalType === "org") {
      values.id = organization._id;
      this.props.contactOrg(values);
    } else {
      values.id = project._id;
      this.props.contactProjectCreator(values);
    }
    this.closeModal();
  };

  render = () => {
    const { loading } = this.state;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          {!loading && (
            <div className="user-dashboard list-view">
              {this.renderChallengeInfo()}
              {this.renderGalleryInfo()}
              {this.renderMedia()}
              {this.renderTeamMembers()}
              {this.renderModal()}
            </div>
          )}
        </Container>
        <Footer />
      </React.Fragment>
    );
  };

  renderChallengeInfo = () => {
    const project = this.props.project.project;
    const organization = this.props.organization.currentOrganization;
    const { label } = this.props;
    return (
      <Row>
        <Col className="mb-5">
          <div className="gallery-chlinfo">
            <div>
              {label.titleChallenge} -{" "}
              {project.challenge && (
                <Link to={`/challenge/${project.challenge._id}`}>
                  {project.challenge.challenge_name}
                </Link>
              )}
            </div>
            <div style={{ fontStyle: "italic", padding: "5px 20px" }}>
              {project.challenge && project.challenge.short_description}
            </div>
            {organization && (
              <div className="orginfo-box">
                <span className="mr-2" style={{ fontSize: "13px" }}>
                  {label.titleChallenge} presented by
                </span>
                <Link to={`/organization/${organization._id}`}>
                  <img src={organization.logo || ProjectAvatar} alt="" />
                </Link>
                <span className="orgname-label">({organization.org_name})</span>
                <Button type="primary" onClick={this.openOrgContact}>
                  Contact this {label.titleOrganization}
                </Button>
              </div>
            )}
            <Button
              className="mobile-btn"
              type="primary"
              onClick={this.openOrgContact}
            >
              Contact this {label.titleOrganization}
            </Button>
          </div>
        </Col>
      </Row>
    );
  };

  renderGalleryInfo = () => {
    const gallery = this.props.gallery.currentGallery;
    const { fieldData, label } = this.props;
    return (
      <Row>
        <Col xl={4} md={5} className="mb-3">
          <div className="project-card">
            <div className="avatar-img">
              <img src={gallery.logo || ProjectAvatar} alt="logo" />
            </div>
          </div>
          <div className="mt-3 flex" style={{ justifyContent: "center" }}>
            <Button type="primary" onClick={this.openProjectContact}>
              Contact the {label.project} team
            </Button>
          </div>
        </Col>
        <Col xl={8} md={7}>
          <div className="gallery-title">
            <h3>{gallery.name}</h3>
            {this.props.isAdmin && (
              <Popconfirm
                title="Are you sure to make private this gallery?"
                onConfirm={() => this.props.privateGallery(gallery._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link">Make Private</Button>
              </Popconfirm>
            )}
          </div>
          <p>{gallery.short_description}</p> <br />
          <div
            className="sun-editor-editable"
            dangerouslySetInnerHTML={{ __html: gallery.description }}
          />
          <Tags
            fieldData={fieldData}
            tags={gallery.tags || []}
            prefix={"gallery"}
          />
        </Col>
      </Row>
    );
  };

  renderModal = () => (
    <Modal
      title="Contact"
      visible={this.state.showModal}
      footer={null}
      onCancel={this.closeModal}
      width={700}
    >
      <ContactForm
        toggleModal={this.closeModal}
        onSubmit={this.contactGallery}
      />
    </Modal>
  );

  renderMedia = () => {
    const gallery = this.props.gallery.currentGallery;
    const { pageNumber, numPages } = this.state;
    return (
      <React.Fragment>
        {gallery.video && (
          <Row>
            <Col>
              <hr className="mb-4" />
              <Video url={gallery.video} />
            </Col>
          </Row>
        )}
        {gallery.file && (
          <Row>
            <Col>
              <hr />
              <h5>
                <FileTextOutlined /> Document
              </h5>
              <Document
                file={gallery.file}
                onLoadSuccess={this.onDocumentLoadSuccess}
                options={options}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    width={window.innerWidth < 768 ? 330 : 820}
                    className={"hide-page-pdf"}
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                  />
                ))}
                <Page
                  width={window.innerWidth < 768 ? 330 : 820}
                  pageNumber={pageNumber}
                />
                <span className="pdf-paginator">
                  <Link to="#" onClick={this.previousPage}>
                    <LeftOutlined />
                  </Link>
                  {pageNumber} of {numPages}
                  <Link to="#" onClick={this.nextPage}>
                    <RightOutlined />
                  </Link>
                  &nbsp; | &nbsp;
                  <a
                    href={`${gallery.file}#1`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FullscreenOutlined />
                  </a>
                </span>
              </Document>
            </Col>
          </Row>
        )}
        {gallery.links && gallery.links.length > 0 && (
          <Row className="gallery-link">
            <Col>
              <hr />
              <h5>
                <LinkOutlined /> Links
              </h5>
              {gallery.links.map((link) => (
                <a
                  key={link.link}
                  className="mr-5"
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.title}
                </a>
              ))}
            </Col>
          </Row>
        )}
      </React.Fragment>
    );
  };

  renderTeamMembers = () => {
    const { participants, project } = this.props.project;
    const { label } = this.props;
    const listItem = participants.filter((item) => item.member === true);
    if (project.participant) listItem.unshift(project);

    return (
      <React.Fragment>
        <hr />
        <h5 className="mt-5">
          <TeamOutlined /> {label.titleProject} Team members
        </h5>
        <List
          itemLayout="horizontal"
          dataSource={listItem}
          renderItem={(item) => (
            <Card key={item._id} className="homepage-card name">
              <Meta
                title={`${item.participant.profile.first_name} ${item.participant.profile.last_name}`}
                avatar={
                  <Avatar src={item.participant.profile.photo || UserAvatar} />
                }
                description={`${item.participant.profile.org_name || ""} ${
                  item.participant.profile.country || ""
                }`}
              />
            </Card>
          )}
        />
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    gallery: state.gallery,
    project: state.project,
    organization: state.organization,
    isAdmin: state.user.isAdmin,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
};

export default connect(mapStateToProps, {
  getGallery,
  getPublicParticipant,
  getProject,
  getOrganization,
  contactProjectCreator,
  contactOrg,
  privateGallery,
})(Gallery);
