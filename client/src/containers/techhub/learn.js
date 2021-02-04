import React from "react";
import { Tabs } from "antd";
import { Header, Footer } from "../../components/template";
import LearnHub from "./learnhub";
import ArticlePage from "./article";

const { TabPane } = Tabs;

class Learn extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <div className="container-fluid content">
          <Tabs type="card" className="techhub-tab">
            <TabPane tab="Learning Hub" key="1">
              <LearnHub />
            </TabPane>
            <TabPane tab="Help Center" key="2">
              <ArticlePage tag="helpcenter" />
            </TabPane>
            <TabPane tab="Demos" key="3">
              <ArticlePage tag="demos" />
            </TabPane>
          </Tabs>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Learn;
