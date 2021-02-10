import React from "react";
import { connect } from "react-redux";
import { Tabs } from "antd";
import { Header, Footer } from "../../components/template";
import ArticlePage from "./article";

const { TabPane } = Tabs;

class Techhub extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabId: "1",
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const tabId = params.get("tab");
    if (tabId) {
      this.setState({ tabId });
    }
  }

  onChange = tabId => {
    this.setState({ tabId });
  };

  render() {
    return (
      <React.Fragment>
        <Header />
        <div className="container-fluid content">
          <Tabs
            type="card"
            className="techhub-tab"
            activeKey={this.state.tabId}
            onChange={this.onChange}
          >
            <TabPane tab="Technical Documentation" key="1">
              <ArticlePage tag="techhub" />
            </TabPane>
            <TabPane tab="Demos" key="2">
              <ArticlePage tag="demos" />
            </TabPane>
            <TabPane tab="Applications" key="3">
              <ArticlePage tag="application" />
            </TabPane>
          </Tabs>
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

export default connect(mapStateToProps, {})(Techhub);
