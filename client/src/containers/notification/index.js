import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Collapse } from "antd";
import { readNotification } from "../../actions/notification";
import { Header, Footer } from "../../components/template";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

class Notification extends Component {
  onChangeNotification = (keyList) => {
    const notifications = this.props.notification.notifications;
    for (let item of notifications) {
      if (keyList.some((key) => key === item._id)) {
        this.props.readNotification(item);
      }
    }
  };

  render() {
    const notifications = this.props.notification.notifications;

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Row>
            <Col>
              <h5>Notifications</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <Collapse
                bordered={false}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                onChange={this.onChangeNotification}
              >
                {notifications.map((item) => {
                  return this.renderNotificationItem(item);
                })}
              </Collapse>
            </Col>
          </Row>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }

  renderSender = (item) => {
    if (!item.author) return null;
    const profile = item.author.profile || {};
    let name = `${profile.first_name} ${profile.last_name}`;
    return (
      <div className="flex">
        <span>{name}</span>
        <img
          src={profile.photo}
          width={30}
          height={30}
          style={{ borderRadius: "50%", marginTop: "-4px", marginLeft: "10px" }}
          alt=""
        />
      </div>
    );
  };

  renderNotificationItem = (item) => (
    <Panel
      header={item.title}
      key={item._id}
      className={`${item.unread && "unread-notif"}`}
      extra={this.renderSender(item)}
    >
      <div
        className="sun-editor-editable"
        dangerouslySetInnerHTML={{ __html: item.body }}
      />
    </Panel>
  );
}

function mapStateToProps(state) {
  return { notification: state.notification };
}

export default connect(mapStateToProps, {
  readNotification,
})(Notification);
