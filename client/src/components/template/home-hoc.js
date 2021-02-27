import React from "react";
import Footer from "./footer";
import { Navbar } from "reactstrap";
import { Link } from "react-router-dom";

const HomeHOC = ({ children, logo, org_name }) => (
  <div className="main-background">
    <div className="main-nav">
      <Navbar className="container-nav" light color="transparent" expand="md">
        <Link className="navbar-brand nav-link" to={`/${org_name || ""}`}>
          {logo && <img src={logo} alt="logo" />}
          {!logo && <span style={{ color: "white" }}>HOME</span>}
        </Link>
      </Navbar>
    </div>
    <div className="content container">{children}</div>
    <Footer />
  </div>
);

export default HomeHOC;
