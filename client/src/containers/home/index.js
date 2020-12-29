import React from "react";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";

const HomePage = () => (
  <HomeHOC>
    <div className="main-background-title mt-big">INTEGRA SPACE</div>
    <div className="home-btn-group">
      <Link to="/login" className="main-btn">
        LOG IN
      </Link>
      <Link to="/register" className="main-btn">
        REGISTER
      </Link>
    </div>
    <p className="home-intro">
      <Link to="/integraspace">What is Integra space?</Link>
    </p>
  </HomeHOC>
);

export default HomePage;
