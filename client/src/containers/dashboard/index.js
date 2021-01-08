import React, { Component } from "react";
import { Container } from "reactstrap";
import { Header } from "../../components/template";

class Dashboard extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <h5 className="mt-5">
            Home = dashboard, quick overview of current projects, notifications
            etc.​
          </h5>
        </Container>
      </React.Fragment>
    );
  }
}

export default Dashboard;
