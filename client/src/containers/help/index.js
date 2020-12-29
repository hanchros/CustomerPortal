import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Input, message } from "antd";
import { Header, Footer } from "../../components/template";
import { Link } from "react-router-dom";
import { FileTextOutlined } from "@ant-design/icons";
import history from "../../history";

const { Search } = Input;

export const orgQuote = "Important Information from the Organizers";
export const chlQuote = "Information About Challenges";

class Help extends Component {
  onSearch = (value) => {
    if (!value || value.length < 3) {
      message.warn("Search text should be more than 3 in length");
      return;
    }
    history.push(`/help-search/${value}`);
  };

  render() {
    const { helpdocs } = this.props;
    const popDocs = helpdocs.filter((hd) => hd.popular === true);

    return (
      <React.Fragment>
        <Header />
        <div className="help-search-block">
          <Search
            size="large"
            placeholder="Search the knowledge base"
            onSearch={this.onSearch}
            enterButton
          />
        </div>
        <Container className="help">
          <h3 className="mb-5" style={{ textAlign: "center" }}>
            Helpful Information
          </h3>
          <Row>
            {popDocs.map((pd) => (
              <Col className="mb-3 help-popular" md={6} key={pd._id}>
                <Link to={`/help-article/${pd.related}/${pd._id}`}>
                  <FileTextOutlined /> {pd.title}
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { helpdocs: state.helpdoc.helpdocs };
}

export default connect(mapStateToProps, {})(Help);
