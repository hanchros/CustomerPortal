import React from "react";
import { connect } from "react-redux";
import { Col, Row, Menu } from "antd";
import { getFieldDataByNameValue } from "../../utils/helper";
import Video from "../../components/pages/video";
import VideoIcon from "../../assets/img/video.png";

const { SubMenu } = Menu;

class Learnhub extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      curArticle: {},
    };
  }

  setArticle = (article) => {
    this.setState({ curArticle: article });
  };

  renderArticles = (article) => {
    return (
      <div className="tech-article-box">
        <h3 className="mb-4">{article.title}</h3>
        {article.video && <Video url={article.video} />}
        <p className="mt-4" />
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
        {article.image && (
          <div className="article-img mt-4">
            <img src={article.image} alt="" />
          </div>
        )}
      </div>
    );
  };

  getArticlesByTopic = () => {
    const { articles, fieldData } = this.props;
    let result = {};
    const techTag = getFieldDataByNameValue(
      fieldData,
      "article_tag",
      "learnhub"
    );
    if (!techTag) return result;
    let filtArticles = articles.filter((item) => item.tag === techTag._id);
    for (let article of filtArticles) {
      if (!result[article.topic] || result[article.topic].length === 0) {
        result[article.topic] = [article];
      } else {
        result[article.topic].push(article);
      }
    }
    return result;
  };

  handleClick = () => {};

  render() {
    const objArticles = this.getArticlesByTopic();
    const keys = Object.keys(objArticles);

    return (
      <Row gutter={40}>
        <Col md={8} sm={16}>
          <Menu
            onClick={this.handleClick}
            className="learnhub-menu"
            mode="inline"
          >
            {keys.map((key) => (
              <React.Fragment key={key}>
                {objArticles[key].length === 1 && (
                  <Menu.Item
                    key={key}
                    onClick={() => this.setArticle(objArticles[key][0])}
                  >
                    <img src={VideoIcon} alt="" />
                    <span>{key}</span>
                  </Menu.Item>
                )}
                {objArticles[key].length > 1 && (
                  <SubMenu key={key} title={key}>
                    {objArticles[key].map((art) => (
                      <Menu.Item
                        key={art._id}
                        onClick={() => this.setArticle(art)}
                      >
                        <img src={VideoIcon} alt="" />
                        <span>{art.title}</span>
                      </Menu.Item>
                    ))}
                  </SubMenu>
                )}
              </React.Fragment>
            ))}
          </Menu>
        </Col>
        <Col md={16} sm={24}>
          {this.renderArticles(this.state.curArticle)}
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    articles: state.article.articles,
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {})(Learnhub);
