import React from "react";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";

const InviteHomePage = () => (
  <HomeHOC>
    <div className="main-background-title mt-big">INTEGRA SPACE</div>
    <p className="home-intro">Explanation – address all friction and fears​</p>
    <div className="home-btn-group">
      <Link to="/register" className="main-btn">
        Begin
      </Link>
    </div>
  </HomeHOC>
);

export default InviteHomePage;
