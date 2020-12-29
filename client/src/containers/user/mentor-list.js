import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Skeleton, Input, Button } from "antd";
import {
  listAllMentors,
  searchMentors,
  clearMentorSearch,
} from "../../actions/auth";
import { Header, Footer, CustomCard } from "../../components/template";
import UserAvatar from "../../assets/img/user-avatar.png";

class MentorList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      searchStr: props.user.searchTxt,
    };
  }

  componentDidMount = async () => {
    const { mentor, listAllMentors } = this.props;
    if (!mentor.participants || mentor.participants.length === 0) {
      this.setState({ loading: true });
      await listAllMentors();
      this.setState({ loading: false });
    }
  };

  onChangeSearch = (e) => {
    this.setState({ searchStr: e.target.value });
  };

  clearSearch = () => {
    this.setState({ searchStr: "" });
    this.props.clearMentorSearch();
    this.props.listAllMentors();
  };

  render() {
    const { mentor, searchMentors } = this.props;
    const users = mentor.participants;
    const { loading, searchStr } = this.state;

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="dashboard">
            <Row>
              <Col className="flex">
                <h5 className="mr-auto">Mentors</h5>
                <Input.Search
                  placeholder="Search"
                  onSearch={searchMentors}
                  onChange={this.onChangeSearch}
                  value={searchStr}
                  style={{ width: 170 }}
                />
                {mentor.searchTxt && (
                  <Button type="link" onClick={this.clearSearch}>
                    CLEAR
                  </Button>
                )}
              </Col>
            </Row>
            <Skeleton active loading={loading} />
            <Skeleton active loading={loading} />
            <Skeleton active loading={loading} />
            <Row>
              {users.map((item, index) => {
                return (
                  <Col key={index} xl={3} lg={4} md={6} sm={12}>
                    <Link
                      className="card-link"
                      style={{ color: "black" }}
                      to={`/participant/${item._id}`}
                    >
                      <CustomCard
                        logo={item.profile.photo || UserAvatar}
                        title={`${item.profile.first_name} ${item.profile.last_name}`}
                        description={item.profile.org_name}
                      />
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </div>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.user, mentor: state.mentor };
}

export default connect(mapStateToProps, {
  listAllMentors,
  searchMentors,
  clearMentorSearch,
})(MentorList);
