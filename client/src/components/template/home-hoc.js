import React from "react";
import Footer from "./footer";
import IntegraLogo from "../../assets/img/logo.png";
import { Navbar } from "reactstrap";
import { Link } from "react-router-dom";

const HomeHOC = ({ children, logo, org_name }) => (
  <div className="main-background">
    <div className="main-nav">
      <Navbar className="container-nav" light color="transparent" expand="md">
        <Link className="navbar-brand" to={`/${org_name || ""}`}>
          <img src={logo || IntegraLogo} alt="logo" />
        </Link>
      </Navbar>
    </div>
    <div className="home-child container">{children}</div>
    <Footer />
  </div>
);

export default HomeHOC;
