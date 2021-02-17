import React from "react";
import ImgGlobal from "../../assets/img/home-bg.png";
import Footer from "./footer";

const HomeHOC = ({ children }) => (
  <div className="main-background">
    <img src={ImgGlobal} alt="" className="home-bg" />
    <div className="home-child container">{children}</div>
    <Footer />
  </div>
);

export default HomeHOC;
