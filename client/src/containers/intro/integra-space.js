import React from "react";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";

const IntegraSpace = () => (
  <HomeHOC>
    <div className="main-background-title">What is AUTOMATION PLACE?</div>
    <p className="mt-5">
      Automation place is a platform where all kinds of organizations can easily
      automate document exchange process.
      <br /> How it is possible?
      <br /> Integra ledger blockchain allows … bla bla
      <br /> After you register, you can integrate, invite, collaborate, learn,
      save time and money​
    </p>
    <div className="is-btn">
      <Link to="/register" className="main-btn">
        REGISTER
      </Link>
    </div>
  </HomeHOC>
);

export default IntegraSpace;
