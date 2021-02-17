import React from "react";
import { connect } from "react-redux";
import { Tabs, Avatar } from "antd";
import { Header, Footer } from "../../components/template";
import ArticlePage from "./article";
import ImageHolder from "../../assets/icon/challenge.png";

const { TabPane } = Tabs;

class Techhub extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabId: "1",
      artId: "",
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const tabId = params.get("tab") || "1";
    const artId = params.get("id") || "";
    this.setState({ tabId, artId });
  }

  onChange = (tabId) => {
    this.setState({ tabId, artId: "" });
  };

  render() {
    const curOrg = this.props.organization.currentOrganization;
    const { tabId, artId } = this.state;
    return (
      <React.Fragment>
        <Header />
        <div className="container-fluid content">
          <Tabs
            type="card"
            className="techhub-tab tab-expand"
            activeKey={tabId}
            onChange={this.onChange}
          >
            <TabPane tab="Technical Documentation" key="1">
              {tabId === "1" && <ArticlePage tag="techhub" />}
            </TabPane>
            <TabPane tab="Demos" key="2">
              {tabId === "2" && <ArticlePage tag="demos" />}
            </TabPane>
            <TabPane tab="Applications" key="3">
              {tabId === "3" && (
                <ArticlePage tag="application" scope={"global"} id={artId} />
              )}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Avatar src={curOrg.logo || ImageHolder} />
                  {`${curOrg.org_name}'s Applications`}
                </span>
              }
              key="4"
            >
              {tabId === "4" && (
                <ArticlePage tag="application" scope={"org"} id={artId} />
              )}
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
    organization: state.organization,
  };
}

export default connect(mapStateToProps, {})(Techhub);
