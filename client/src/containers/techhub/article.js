import React from "react";
import { connect } from "react-redux";
import { GlobalOutlined } from "@ant-design/icons";
import { List, Collapse } from "antd";
import { Row, Col } from "reactstrap";
import { getFieldDataByNameValue } from "../../utils/helper";
import Video from "../../components/pages/video";
import ImageHolder from "../../assets/icon/challenge.png";
import Avatar from "antd/lib/avatar/avatar";

const { Panel } = Collapse;

class ArticlePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: "",
      curArticles: [],
    };
  }

  componentDidMount() {
    const result = this.getTitles();
    if (result.length > 0) {
      this.setState({
        topic: result[0].topic,
        curArticles: result[0].articles,
      });
    }
  }

  onSelectTitle = (tp) => {
    const result = this.getTitles();
    for (let group of result) {
      if (group.topic === tp) {
        this.setState({ topic: tp, curArticles: group.articles });
      }
    }
  };

  getTitles = () => {
    const { fieldData, articles, tag } = this.props;
    let result = [];
    const techTag = getFieldDataByNameValue(fieldData, "article_tag", tag);
    if (!techTag) return result;
    for (let article of articles) {
      if (article.tag !== techTag._id) continue;
      let flt = result.filter((item) => item.topic === article.topic);
      if (flt.length === 0) {
        result.push({
          topic: article.topic,
          icon: article.icon || ImageHolder,
          articles: [article],
        });
      } else {
        flt[0].articles.push(article);
        flt[0].icon = article.icon || flt[0].icon;
      }
    }
    return result;
  };

  getTechTitles = () => {
    const { fieldData, articles, organization, tag } = this.props;
    let result = [];
    const curOrg = organization.currentOrganization;
    const topicname = `${curOrg.org_name} Applications`;
    const techTag = getFieldDataByNameValue(fieldData, "article_tag", tag);
    if (!techTag) return result;

    let exTechs = articles.filter(
      (item) => item.tag === techTag._id && item.organization === curOrg._id
    );
    let globalTechs = articles.filter(
      (item) => item.tag === techTag._id && !item.organization
    );
    result.push({
      topic: topicname,
      icon: curOrg.logo || ImageHolder,
      articles: exTechs,
    });

    for (let article of globalTechs) {
      let flt = result.filter((item) => item.topic === article.topic);
      if (flt.length === 0) {
        result.push({
          topic: article.topic,
          icon: article.icon || ImageHolder,
          articles: [article],
        });
      } else {
        flt[0].articles.push(article);
        flt[0].icon = article.icon || flt[0].icon;
      }
    }
    return result;
  };

  renderTitleItem = (item) => (
    <List.Item
      onClick={() => this.onSelectTitle(item.topic)}
      className={this.state.topic === item.topic && "active"}
    >
      <Avatar src={item.icon} />
      &nbsp;&nbsp;
      {item.topic}
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
    let techTitleTags = this.getTitles();
    if (this.props.tag === "application") {
      techTitleTags = this.getTechTitles();
    }
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
    organization: state.organization,
  };
}

export default connect(mapStateToProps, {})(ArticlePage);
