import React from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import LearnHub from "./learnhub";
import HelpCenter from "./help_center";

class Learn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
    };
  }

  setPage = (page) => {
    this.setState({ page });
  };

  render() {
    const { page } = this.state;

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="learn-header">
            <Link
              to="#"
              className={page === 0 ? "active" : ""}
              onClick={() => this.setPage(0)}
            >
              LEARNING HUB
            </Link>
            <Link
              to="#"
              className={page === 1 ? "active" : ""}
              onClick={() => this.setPage(1)}
            >
              Help Center
            </Link>
            <Link
              to="#"
              className={page === 2 ? "active" : ""}
              onClick={() => this.setPage(2)}
            >
              Demos
            </Link>
          </div>
          <div className="learn-body">
            {page === 0 && <LearnHub />}
            {page === 1 && <HelpCenter />}
            {page === 2 && <h2>Demos</h2>}
          </div>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Learn;
