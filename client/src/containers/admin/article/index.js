import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import {
  Collapse,
  Button,
  Modal,
  Tooltip,
  Tag,
  Input,
  Select,
  message,
} from "antd";
import {
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../../actions/article";
import { SettingOutlined } from "@ant-design/icons";
import EditArticle from "./edit_form";
import Video from "../../../components/pages/video";
import {
  getFieldData,
  getFieldDataById,
  extractContent,
} from "../../../utils/helper";

const { Panel } = Collapse;
const { Search } = Input;

class AdminArticle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      article: {},
      loading: false,
      searchTxt: "",
      filterTag: "",
      filterTopic: "",
      filtArts: [],
    };
  }

  componentDidMount = () => {
    this.setState({ filtArts: this.props.articles });
  };

  genExtra = (hd) => (
    <Tooltip title="Edit">
      <SettingOutlined
        onClick={(event) => {
          event.stopPropagation();
          this.setState({
            visible: true,
            article: hd,
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
    this.filterArticles()
  };

  setLoading = (loading) => {
    this.setState({ loading });
  };

  getTopics = (articles) => {
    let topics = [];
    for (let article of articles) {
      if (topics.indexOf(article.topic) === -1) {
        topics.push(article.topic);
      }
    }
    return topics;
  };

  onChangeFiltTag = (tagId) => {
    this.setState({ filterTag: tagId }, this.filterArticles);
  };

  onChangeFiltTopic = (topic) => {
    this.setState({ filterTopic: topic }, this.filterArticles);
  };

  onChangeSearch = (value) => {
    this.setState({ searchTxt: value }, this.filterArticles);
  };

  filterArticles = () => {
    const { searchTxt, filterTag, filterTopic } = this.state;
    const { articles } = this.props;
    if (searchTxt && searchTxt.length < 3) {
      message.error("search text shouldn't be less than 3 in length");
      return;
    }
    let filtArts = articles;
    if (filterTag) filtArts = articles.filter((item) => item.tag === filterTag);
    if (filterTopic)
      filtArts = filtArts.filter((item) => item.topic === filterTopic);
    if (searchTxt) {
      filtArts = filtArts.filter((item) => {
        if (item.title.toLowerCase().includes(searchTxt.toLowerCase()))
          return true;
        if (
          extractContent(item.content, true)
            .toLowerCase()
            .includes(searchTxt.toLowerCase())
        )
          return true;
        return false;
      });
    }
    this.setState({ filtArts });
  };

  renderDocHeader = (article) => {
    const tag = getFieldDataById(this.props.fieldData, article.tag);
    return (
      <span>
        <b className="mr-5">{article.title}</b>
        {tag && <Tag color="green">{tag.value}</Tag>}
        {article.topic && (
          <span className="ml-4">
            {"<"}
            {article.topic}
            {">"}
          </span>
        )}
      </span>
    );
  };

  render() {
    const {
      articles,
      createArticle,
      updateArticle,
      deleteArticle,
      fieldData,
    } = this.props;
    const { article, visible, loading, filtArts } = this.state;
    const topics = this.getTopics(articles);
    const tags = getFieldData(fieldData, "article_tag");

    return (
      <div className="container">
        <Row>
          <Col>
            <h5 className="mr-auto">Articles</h5>
            <div className="article-filter-box">
              <div>
                <span className="ml-1">text:</span>
                <br />
                <Search
                  placeholder="input search text"
                  onSearch={this.onChangeSearch}
                  style={{ width: 150 }}
                  allowClear
                />
              </div>
              <div>
                <span className="ml-1">tag:</span>
                <br />
                <Select
                  placeholder="Article Type​"
                  style={{ width: 150 }}
                  onChange={this.onChangeFiltTag}
                  allowClear
                >
                  {tags.map((item) => {
                    return (
                      <Select.Option key={item._id} value={item._id}>
                        {item.value}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
              <div>
                <span className="ml-1">topic:</span>
                <br />
                <Select
                  placeholder="Article Topic"
                  style={{ width: 150 }}
                  onChange={this.onChangeFiltTopic}
                  allowClear
                >
                  {topics.map((item) => {
                    return (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </div>
          </Col>
        </Row>
        {!loading && (
          <Collapse accordion>
            {filtArts.map((hd) => (
              <Panel
                header={this.renderDocHeader(hd)}
                key={hd._id}
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
        )}
        <Button type="primary" className="mt-5" onClick={this.createNew}>
          Add New
        </Button>
        {visible && (
          <Modal
            title={`${article._id ? "Update" : "Create"} Article`}
            visible={visible}
            width={800}
            footer={false}
            onCancel={this.hideModal}
          >
            <EditArticle
              article={article}
              createArticle={createArticle}
              updateArticle={updateArticle}
              deleteArticle={deleteArticle}
              hideModal={this.hideModal}
              setLoading={this.setLoading}
              topics={topics}
              tags={tags}
            />
          </Modal>
        )}
      </div>
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
})(AdminArticle);
