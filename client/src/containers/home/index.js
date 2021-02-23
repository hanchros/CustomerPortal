import React from "react";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";

const HomePage = () => (
  <HomeHOC>
    <div className="flex-colume-center">
      
      <div className="main-background-title mt-5">AUTOMATION PLACE</div>
      <div className="home-btn-group mt-5 mb-5">
        <Link to="/login" className="main-btn">
          LOG IN
        </Link>
        <Link to="/register" className="main-btn">
          REGISTER
        </Link>
      </div>
      <p className="home-intro">
        <Link to="/integraspace">What is Automation Place?</Link>
      </p>
    </div>
  </HomeHOC>
);

export default HomePage;
