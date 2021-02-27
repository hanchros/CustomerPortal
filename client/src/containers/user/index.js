import React, { Component } from "react";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import { Header, Footer } from "../../components/template";
import ChangePassword from "./change_password";
import Profile from "./profilepage";
import Notifications from "./notifications";

class MyAccount extends Component {
  constructor() {
    super();

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
        <div className="account-nav">
          <Container>
            <Link
              to="#"
              onClick={() => this.setPage(0)}
              className={page === 0 ? "active" : ""}
            >
              <p>Profile</p>
            </Link>
            <Link
              to="#"
              onClick={() => this.setPage(1)}
              className={`${page === 1 ? "active" : ""} ml-4`}
            >
              <p>Change Password</p>
            </Link>
            <Link
              to="#"
              onClick={() => this.setPage(2)}
              className={`${page === 2 ? "active" : ""} ml-4`}
            >
              <p>Notifications</p>
            </Link>
          </Container>
        </div>
        {page === 0 && <Profile />}
        {page === 1 && <ChangePassword />}
        {page === 2 && <Notifications />}
        <Footer />
      </React.Fragment>
    );
  }
}

export default MyAccount;
