import React from "react";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";

const InvitePage = () => (
  <HomeHOC>
    <div className="main-background-title">What is "an invitation"?</div>
    <p className="mt-5">
      This is a safe space where companies come to collaborate on documents
      automation projects.​
      <br /> Once you are registered – you can invite your partners and clients
      to work to collaborate or colleagues to join organization.​
      <br /> Invited party will receive an email link with personal invitation
      letter after Registration you will already have shared project to work on.
      <br /> It is very important to use that link if you have it!​
      <br /> If you don’t – not a problem! Register new organization now​
    </p>
    <div className="inv-btn">
      <Link to="/register" className="main-btn">
        Back to REGISTERATION
      </Link>
      <Link to="/integraspace" className="inv-learn">
        Or learn more about the platform
      </Link>
    </div>
  </HomeHOC>
);

export default InvitePage;
