import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Header, Footer } from "../../components/template";
import { Skeleton, List, Card, Avatar, Button } from "antd";
import { getPublicParticipant, getProject } from "../../actions/project";
import { getOrganization } from "../../actions/organization";
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
  RollbackOutlined,
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
    };
  }

  componentDidMount = async () => {
    const {
      gallery,
      getPublicParticipant,
      getProject,
      getOrganization,
    } = this.props;
    this._isMounted = true;
    this.setState({ loading: true });
    await getPublicParticipant(gallery.currentGallery.project);
    if (!this._isMounted) return;
    this.setState({ loading: false });
    let curProject = await getProject(gallery.currentGallery.project);
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

  render = () => {
    const { loading } = this.state;
    const { label } = this.props;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          {!loading && (
            <div className="user-dashboard list-view">
              <div style={{ width: "100%", textAlign: "center" }}>
                <h2>{label.titleGallery} Preview</h2>
              </div>
              <Row>
                <Col>
                  <Button
                    type="primary"
                    className="mb-3"
                    style={{ float: "right" }}
                    onClick={this.props.togglePreview}
                  >
                    <RollbackOutlined /> Back to {label.titleProject}
                  </Button>
                </Col>
              </Row>
              {this.renderChallengeInfo()}
              {this.renderGalleryInfo()}
              {this.renderMedia()}
              {this.renderTeamMembers()}
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
              </div>
            )}
          </div>
        </Col>
      </Row>
    );
  };

  renderGalleryInfo = () => {
    const gallery = this.props.gallery.currentGallery;
    const { fieldData } = this.props;
    return (
      <Row>
        <Col xl={4} md={5} className="mb-3">
          <div className="project-card">
            <div className="avatar-img">
              <img src={gallery.logo || ProjectAvatar} alt="logo" />
            </div>
          </div>
        </Col>
        <Col xl={8} md={7}>
          <h3>{gallery.name}</h3>
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
    const listItem = participants.filter((item) => item.member === true);
    if (project.participant) listItem.unshift(project);

    return (
      <React.Fragment>
        <hr />
        <h5 className="mt-5">
          <TeamOutlined /> {this.props.label.titleProject} Team members
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
    fieldData: state.profile.fieldData,
    label: state.label,
  };
};

export default connect(mapStateToProps, {
  getPublicParticipant,
  getProject,
  getOrganization,
})(Gallery);
