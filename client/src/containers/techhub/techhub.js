import React from "react";
import { connect } from "react-redux";
import {
  PlusOutlined,
  SettingOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { List, Collapse, Modal, Tooltip, Button } from "antd";
import { Row, Col } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { getFieldDataByNameValue } from "../../utils/helper";
import Video from "../../components/pages/video";
import EditArticle from "./edit_form";
import {
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../actions/article";

const { Panel } = Collapse;

class Techhub extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: "",
      curArticles: [],
      curArticle: {},
      visible: false,
    };
  }

  onSelectTitle = (tp) => {
    const { articles, fieldData } = this.props;
    const techTag = getFieldDataByNameValue(
      fieldData,
      "article_tag",
      "techhub"
    );
    let arts = [];
    if (!techTag) return arts;
    for (let article of articles) {
      if (
        article.tag === techTag._id &&
        article.topic.toLowerCase() === tp.toLowerCase()
      ) {
        arts.push(article);
      }
    }
    this.setState({ topic: tp, curArticles: arts });
  };

  getTitles = () => {
    const { fieldData, articles } = this.props;
    let result = [];
    const techTag = getFieldDataByNameValue(
      fieldData,
      "article_tag",
      "techhub"
    );
    if (!techTag) return result;
    for (let article of articles) {
      if (article.tag === techTag._id && result.indexOf(article.topic) === -1) {
        result.push(article.topic);
      }
    }
    return result;
  };

  genExtra = (hd) => (
    <Tooltip title="Edit">
      <SettingOutlined
        onClick={(event) => {
          event.stopPropagation();
          this.setState({
            visible: true,
            curArticle: hd,
          });
        }}
      />
    </Tooltip>
  );

  createNew = () => {
    this.setState({
      article: {},
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      article: {},
      visible: false,
    });
  };

  renderTitleItem = (item) => (
    <List.Item
      onClick={() => this.onSelectTitle(item)}
      className={this.state.topic === item && "active"}
    >
      {item}
    </List.Item>
  );

  renderOneArticle = (article) => {
    if (article.iframe && article.show_iframe)
      return (
        <Row>
          <Col md={4}>
            <h3 className="mb-3">
              <b>{article.title}</b>
            </h3>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
            {article.files && article.files.length > 0 && (
              <div className="download-file-box">
                <span>Documents for download</span>
                <br />
                {article.files.map((file) => (
                  <div key={file}>
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      title={file.replace(/^.*[\\/]/, "")}
                    >
                      {file.replace(/^.*[\\/]/, "")}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </Col>
          <Col md={8}>
            <iframe
              src={article.iframe}
              is="x-frame-bypass"
              title="demo-iframe"
              style={{ width: "100%", height: "98%", minHeight: "60vh" }}
            />
          </Col>
        </Row>
      );
    return (
      <React.Fragment>
        <h3 className="mb-3">
          <b>{article.title}</b>
        </h3>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
        {article.image && (
          <div className="article-img">
            <img src={article.image} alt="" />
          </div>
        )}
        {article.video && <Video url={article.video} />}
        <div className="iframe-box">
          {article.files && article.files.length > 0 && (
            <div className="download-file-box">
              <span>Documents for article</span>
              <br />
              {article.files.map((file) => (
                <div key={file}>
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    title={file.replace(/^.*[\\/]/, "")}
                  >
                    {file.replace(/^.*[\\/]/, "")}
                  </a>
                </div>
              ))}
            </div>
          )}
          {article.iframe && (
            <div className="demo-site-link">
              <a
                href={article.iframe}
                target="_blank"
                rel="noopener noreferrer"
                className="main-btn"
              >
                <GlobalOutlined /> {article.button_name || "Go To Site"}
              </a>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  };

  renderMultiArticles = (articles) => (
    <React.Fragment>
      <div className="right-flex mt-2 mb-3">
        <Button type="primary" onClick={this.createNew}>
          <PlusOutlined />
          Add New
        </Button>
      </div>
      <Collapse accordion>
        {articles.map((hd) => (
          <Panel
            header={<b>{hd.title}</b>}
            key={hd.title}
            extra={this.genExtra(hd)}
          >
            <div
              className="sun-editor-editable"
              dangerouslySetInnerHTML={{ __html: hd.content }}
            />
            {hd.image && (
              <div className="article-img">
                <img src={hd.image} alt="" />
              </div>
            )}
            {hd.video && <Video url={hd.video} />}
            {hd.files && hd.files.length > 0 && (
              <div className="download-file-box">
                <span>Documents for download</span>
                <br />
                {hd.files.map((file) => (
                  <div key={file}>
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      title={file.replace(/^.*[\\/]/, "")}
                    >
                      {file.replace(/^.*[\\/]/, "")}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        ))}
      </Collapse>
    </React.Fragment>
  );

  renderArticles = () => {
    const { curArticles, visible, curArticle, topic } = this.state;
    const {
      createArticle,
      updateArticle,
      deleteArticle,
      fieldData,
    } = this.props;
    const techTag = getFieldDataByNameValue(
      fieldData,
      "article_tag",
      "techhub"
    );

    if (curArticles.length === 0) return null;
    return (
      <div className="tech-article-box">
        {curArticles.length === 1 && this.renderOneArticle(curArticles[0])}
        {curArticles.length > 1 && this.renderMultiArticles(curArticles)}
        {visible && (
          <Modal
            title={`${curArticle._id ? "Update" : "Create"} Article`}
            visible={visible}
            width={800}
            footer={false}
            onCancel={this.hideModal}
          >
            <EditArticle
              article={curArticle}
              createArticle={createArticle}
              updateArticle={updateArticle}
              deleteArticle={deleteArticle}
              hideModal={this.hideModal}
              topic={topic}
              tag={techTag._id}
              refreshTopic={this.onSelectTitle}
            />
          </Modal>
        )}
      </div>
    );
  };

  render() {
    const techTitleTags = this.getTitles();
    return (
      <React.Fragment>
        <Header />
        <div className="container-fluid content">
          <Row>
            <Col md={3} sm={12}>
              <List
                size="large"
                dataSource={techTitleTags}
                className="techhub-title-list"
                renderItem={this.renderTitleItem}
              />
            </Col>
            <Col md={9} sm={12}>
              {this.renderArticles()}
            </Col>
          </Row>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    articles: state.article.articles,
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {
  createArticle,
  updateArticle,
  deleteArticle,
})(Techhub);
