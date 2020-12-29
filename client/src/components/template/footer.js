import React from "react";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import Container from "reactstrap/lib/Container";
import Policy from "../../containers/privacy/policy";
import Rules from "../../containers/privacy/rule";

const ruleTitle = "Hackathon Dev Rules";
const policyTitle = "Hackathon Dev Privacy Policy";

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showmodal: false,
      page: "",
    };
  }

  openModal = (page) => {
    this.setState({
      showmodal: true,
      page: page,
    });
  };

  hideModal = () => {
    this.setState({
      showmodal: false,
      page: "",
    });
  };

  render() {
    const { showmodal, page } = this.state;
    return (
      <div className="footer">
        <Container>
          <div className="footer-poweredby">
            <span>POWERED BY</span>
            <a href="https://integraledger.com/" target="blank">
              <img
                src={require("../../assets/img/integra-white.png")}
                height="50px"
                alt=""
              />
            </a>
          </div>
          <div className="footer-address">
            Integra Ledger
            <br />
            498 7th Avenue 12th Floor, <br />
            New York, NY 10018
          </div>
          <div className="footer-list">
            <a className="footer-link" href="mailto:events@dev.com">
              Contact
            </a>
            <br />
            <Link to="/summary" className="footer-link">
              How it Works
            </Link>
            <br />
            <Link
              to="#"
              onClick={() => this.openModal("policy")}
              className="footer-link"
            >
              Privacy Policy
            </Link>
            <br />
            <Link
              to="#"
              onClick={() => this.openModal("rules")}
              className="footer-link"
            >
              Official Rules
            </Link>
          </div>
        </Container>
        <Modal
          title={page === "policy" ? policyTitle : ruleTitle}
          visible={showmodal}
          width={800}
          footer={false}
          onCancel={this.hideModal}
          className="privacy-modal"
        >
          {page === "policy" && <Policy />}
          {page === "rules" && <Rules />}
        </Modal>
      </div>
    );
  }
}

export default Footer;
