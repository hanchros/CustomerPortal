import React from "react";
import { connect } from "react-redux";
import ArticlePage from "./article";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";

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
            <p>Technical Documentation</p>
          </Link>
          <Link
            to="#"
            onClick={() => this.onChange("2")}
            className={`${tabId === "2" ? "active" : ""} ml-4`}
          >
            <p>Demos</p>
          </Link>
          <Link
            to="#"
            onClick={() => this.onChange("3")}
            className={`${tabId === "3" ? "active" : ""} ml-4`}
          >
            <p>Integra Integrations</p>
          </Link>
        </Container>
      </div>
    );
  };

  render() {
    const { tabId, artId } = this.state;
    return (
      <React.Fragment>
        {this.renderTabHeader()}
        <div className="container sub-content">
          {tabId === "1" && <ArticlePage tag="techhub" />}
          {tabId === "2" && <ArticlePage tag="demos" />}
          {tabId === "3" && (
            <ArticlePage tag="application" scope={"global"} id={artId} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    organization: state.organization,
    user: state.user.profile,
  };
}

export default connect(mapStateToProps, {})(Techhub);
