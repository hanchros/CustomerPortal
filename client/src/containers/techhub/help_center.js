import React from "react";
import { connect } from "react-redux";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { Col, Row, List, Collapse, Modal, Tooltip, Button } from "antd";
import { getFieldDataByNameValue } from "../../utils/helper";
import Video from "../../components/pages/video";
import EditArticle from "./edit_form";
import {
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../actions/article";

const { Panel } = Collapse;

class HelpCenter extends React.Component {
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
      "helpcenter"
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
      "helpcenter"
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
      "helpcenter"
    );

    return (
      <div className="tech-article-box">
        <div className="right-flex mt-2 mb-3">
          <Button type="primary" onClick={this.createNew}>
            <PlusOutlined />
            Add New
          </Button>
        </div>
        <Collapse accordion>
          {curArticles.map((hd) => (
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
            </Panel>
          ))}
        </Collapse>
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
      <Row gutter={10}>
        <Col md={6} sm={24} className="techhub-box mr-4">
          <List
            size="large"
            dataSource={techTitleTags}
            className="techhub-title-list"
            renderItem={this.renderTitleItem}
          />
        </Col>
        <Col md={17} sm={24} className="techhub-box content-box">
          {this.renderArticles()}
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

export default connect(mapStateToProps, {
  createArticle,
  updateArticle,
  deleteArticle,
})(HelpCenter);
