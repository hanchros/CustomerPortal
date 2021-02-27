import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import HomeHOC from "../../components/template/home-hoc";
import history from "../../history";

class HomePage extends React.Component {
  render() {
    return (
      <HomeHOC>
        <div className="flex-colume-center">
          <div className="home-page">
            <div className="main-background-title">
              Let's safe collaboration started
            </div>
            <Button
              type="ghost"
              className="black-btn mt-5"
              onClick={() => history.push("/login")}
            >
              log in
            </Button>
            <Button
              type="ghost"
              className="ghost-btn mt-3 mb-5"
              onClick={() => history.push("/register")}
            >
              register
            </Button>
            <b>Want to know more about the service?</b>
            <Link to="/integraspace">Read this article about the platform</Link>
          </div>
        </div>
      </HomeHOC>
    );
  }
}

export default HomePage;
