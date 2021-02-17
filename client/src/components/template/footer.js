import React from "react";
import { Container } from "reactstrap"
import FooterImg from "../../assets/img/integra.svg";

const Footer = () => (
  <div className="footer-box">
    <Container>
      Powered by
      <img src={FooterImg} alt="" />
    </Container>
  </div>
);

export default Footer;
