import React from "react";
import { connect } from "react-redux";
import { GlobalOutlined } from "@ant-design/icons";
import { List, Collapse } from "antd";
import { Row, Col } from "reactstrap";
import { getFieldDataByNameValue } from "../../utils/helper";
import Video from "../../components/pages/video";

const { Panel } = Collapse;

class ArticlePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: "",
      curArticles: [],
      curArticle: {},
    };
  }

  onSelectTitle = (tp) => {
    const { articles, fieldData, tag } = this.props;
    const techTag = getFieldDataByNameValue(fieldData, "article_tag", tag);
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
    const { fieldData, articles, tag } = this.props;
    let result = [];
    const techTag = getFieldDataByNameValue(fieldData, "article_tag", tag);
    if (!techTag) return result;
    for (let article of articles) {
      if (article.tag === techTag._id && result.indexOf(article.topic) === -1) {
        result.push(article.topic);
      }
    }
    return result;
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
      <Collapse accordion>
        {articles.map((hd) => (
          <Panel header={<b>{hd.title}</b>} key={hd.title}>
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
    const { curArticles } = this.state;
    return (
      <div className="tech-article-box">
        {curArticles.length === 1 && this.renderOneArticle(curArticles[0])}
        {curArticles.length > 1 && this.renderMultiArticles(curArticles)}
      </div>
    );
  };

  render() {
    const techTitleTags = this.getTitles();
    return (
      <React.Fragment>
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

export default connect(mapStateToProps, {})(ArticlePage);
