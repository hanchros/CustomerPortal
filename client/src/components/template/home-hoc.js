import React from "react";
import ImgFt from "../../assets/img/home-footer.png";
import ImgGlobal from "../../assets/img/home-bg.png";

const HomeHOC = ({ children }) => (
  <div className="main-background">
    <img src={ImgGlobal} alt="" className="home-bg" />
    <div className="home-child container">{children}</div>
    <img src={ImgFt} alt="" className="home-footer" />
  </div>
);

export default HomeHOC;
