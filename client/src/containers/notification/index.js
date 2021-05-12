import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import {
  readNotification,
  resolveNotification,
} from "../../actions/notification";
import { acceptOrgProject, resolveInvite } from "../../actions/invite";
import { Header } from "../../components/template";
import { ClockCircleOutlined, LeftOutlined } from "@ant-design/icons";
import history from "../../history";
import moment from "moment";

class Notification extends Component {
  componentDidMount = () => {
    const { notification, user } = this.props;
    const notifications = notification.notifications;
    for (let item of notifications) {
      if (!item.read.some((key) => key === user._id))
        this.props.readNotification(item);
    }
  };

  goBack = () => {
    history.goBack();
  };

  onAcceptInvite = async (item) => {
    const { resolveNotification, acceptOrgProject, resolveInvite } = this.props;
    await acceptOrgProject(item.invite);
    await resolveInvite(item.invite, true);
    await resolveNotification(item._id, "accepted");
  };

  onDeclineInvite = async (item) => {
    const { resolveNotification, resolveInvite } = this.props;
    await resolveInvite(item.invite, false);
    await resolveNotification(item._id, "declined");
  };

  renderNotificationItem = (item) => (
    <div key={item._id} className="notif-box">
      <div className="main-body">
        <div className="flex mb-3" style={{ justifyContent: "space-between" }}>
          <h5>
            <b>{item.title}</b>
          </h5>
          <span className="date-format">
            <ClockCircleOutlined className="mr-2" />
            {moment(item.createdAt).format("MMM DD, h:mmA")}
          </span>
        </div>
        <div
          style={{ fontSize: "14px" }}
          className="notif-content"
          dangerouslySetInnerHTML={{ __html: item.body }}
        />
        {item.status && item.status !== "pending" && (
          <div className="mt-3">You have {item.status} the invitation</div>
        )}
      </div>
    </div>
  );

  render() {
    const notifications = this.props.notification.notifications;

    return (
      <React.Fragment>
        <Header />
        <div className="account-nav">
          <Container>
            <Link to="#" onClick={this.goBack}>
              <p>
                <LeftOutlined /> Go back
              </p>
            </Link>
          </Container>
        </div>
        <Container className="sub-content">
          <Row>
            <Col md={4} className="mb-4">
              <h4 className="mb-4">
                <b>Notifications</b>
              </h4>
            </Col>
            <Col md={8}>
              {notifications.map((item) => {
                return this.renderNotificationItem(item);
              })}
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { notification: state.notification, user: state.user.profile };
}

export default connect(mapStateToProps, {
  readNotification,
  resolveInvite,
  acceptOrgProject,
  resolveNotification,
})(Notification);
