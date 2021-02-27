import React from "react";
import { connect } from "react-redux";
import { GlobalOutlined } from "@ant-design/icons";
import { List, Collapse } from "antd";
import { Row, Col } from "reactstrap";
import { getFieldDataByNameValue } from "../../utils/helper";
import Video from "../../components/pages/video";
import Avatar from "antd/lib/avatar/avatar";
import { listArticle } from "../../actions/article";
import { listFieldData } from "../../actions/profile";

const { Panel } = Collapse;

class ArticlePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: "",
      curArticles: [],
      groups: [],
    };
  }

  componentDidMount = async () => {
    const {
      tag,
      articles,
      listArticle,
      id,
      listFieldData,
      fieldData,
    } = this.props;
    if (articles.length === 0) {
      await listArticle();
    }
    if (fieldData.length === 0) {
      await listFieldData();
    }
    let groups = [];
    if (tag === "application") groups = this.getTechTitles();
    else groups = this.getTitles();
    if (groups.length === 0) return;
    if (id) {
      for (let group of groups) {
        if (group.articles[0]._id === id) {
          this.setState({
            topic: group.topic,
            curArticles: group.articles,
            groups,
          });
          return;
        }
      }
    } else {
      this.setState({
        topic: groups[0].topic,
        curArticles: groups[0].articles,
        groups,
      });
    }
  };

  onSelectTitle = (tp, title) => {
    const result = this.state.groups;
    for (let group of result) {
      if (group.topic === tp || group.topic === title) {
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
          icon: article.icon,
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
    const { fieldData, articles, organization, tag, scope } = this.props;
    let result = [];
    const curOrg = organization.currentOrganization;
    const techTag = getFieldDataByNameValue(fieldData, "article_tag", tag);
    if (!techTag) return result;

    let techs = [];
    if (scope === "org") {
      techs = articles.filter(
        (item) => item.tag === techTag._id && item.organization === curOrg._id
      );
    } else {
      techs = articles.filter(
        (item) => item.tag === techTag._id && !item.organization
      );
    }
    for (let article of techs) {
      result.push({
        topic: article.title,
        icon: article.icon,
        articles: [article],
      });
    }
    return result;
  };

  renderTitleItem = (item) => (
    <List.Item
      onClick={() => this.onSelectTitle(item.topic, item.title)}
      className={this.state.topic === item.topic && "active"}
    >
      <span style={{ width: "80%" }}>{item.topic}</span>
      {item.icon && <Avatar src={item.icon} />}
    </List.Item>
  );

  renderOneArticle = (article) => {
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
          {article.iframe && !article.show_iframe && (
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
        {article.iframe && article.show_iframe && (
          <iframe
            src={article.iframe}
            is="x-frame-bypass"
            title="demo-iframe"
            style={{ width: "100%", height: "98%", minHeight: "60vh" }}
          />
        )}
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

    if (curArticles.length === 0) return null;
    return (
      <div className="account-form-box">
        {curArticles.length === 1 && this.renderOneArticle(curArticles[0])}
        {curArticles.length > 1 && this.renderMultiArticles(curArticles)}
      </div>
    );
  };

  render() {
    const techTitleTags = this.state.groups;
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

export default connect(mapStateToProps, { listArticle, listFieldData })(
  ArticlePage
);
