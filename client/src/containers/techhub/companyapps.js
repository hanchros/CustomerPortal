import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { List } from "antd";

class CompanyApps extends Component {
  constructor() {
    super();

    this.state = {
      title: "",
    };
  }

  componentDidMount = () => {
    const services = this.props.user.profile.services;
    if (services && services.length > 0) {
      const title = services[0].title;
      this.setState({ title });
    }
  };

  renderTitleItem = (title) => (
    <List.Item
      onClick={() => this.setState({ title })}
      className={this.state.title === title && "active"}
    >
      <span>{title}</span>
    </List.Item>
  );

  render() {
    const { user } = this.props;
    const { title } = this.state;
    const services = user.profile.services;
    let titles = [],
      items = [];
    for (let sv of services) {
      if (sv.items.length > 0) titles.push(sv.title);
      if (sv.title === title) items = sv.items;
    }
    return (
      <Row>
        <Col md={4}>
          <List
            size="large"
            dataSource={titles}
            className="techhub-title-list"
            renderItem={this.renderTitleItem}
          />
        </Col>
        <Col md={8}>
          <div className="account-form-box mb-3" style={{ minHeight: "40vh" }}>
            {items.map((item) => (
              <h5 key={item} className="mb-4">
                <b>{item}</b>
              </h5>
            ))}
          </div>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
  };
}

export default connect(mapStateToProps, {})(CompanyApps);
