import React from "react";
import { Header, Footer } from "../../components/template";
import ArticlePage from "./article";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";

class Learn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabId: "1",
    };
  }

  onChange = (tabId) => {
    this.setState({ tabId });
  };

  renderTabHeader = () => {
    const { tabId } = this.state;
    return (
      <div className="account-nav">
        <Container className="subnav-responsive">
          <Link
            to="#"
            onClick={() => this.onChange("1")}
            className={tabId === "1" ? "active" : ""}
          >
            <p>Learning Hub</p>
          </Link>
          <Link
            to="#"
            onClick={() => this.onChange("2")}
            className={`${tabId === "2" ? "active" : ""} ml-4`}
          >
            <p>Help Center</p>
          </Link>
          <Link
            to="#"
            onClick={() => this.onChange("3")}
            className={`${tabId === "3" ? "active" : ""} ml-4`}
          >
            <p>Demos</p>
          </Link>
        </Container>
      </div>
    );
  };

  render() {
    const { tabId } = this.state;
    return (
      <React.Fragment>
        <Header />
        {this.renderTabHeader()}
        <div className="container sub-content">
          {tabId === "1" && <ArticlePage tag="learnhub" />}
          {tabId === "2" && <ArticlePage tag="helpcenter" />}
          {tabId === "3" && <ArticlePage tag="demos" />}
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Learn;
