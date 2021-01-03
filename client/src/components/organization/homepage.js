import React from "react";
import { Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { Avatar, Card, List, PageHeader, Descriptions } from "antd";
import { Link } from "react-router-dom";
import sampleUrl from "../../assets/img/user-avatar.png";
import Tags from "../pages/tags";

const { Meta } = Card;

const Users = (props) => (
  <div className="list-view">
    <Row>
      <Col>
        <h5>Participant from {props.name}</h5>
      </Col>
    </Row>
    <div className="participant_dashboard">
      <Card className="homepage-card name">
        <Meta
          title={
            props.organization.currentOrganization.authorized_name || props.name
          }
          avatar={
            <Avatar
              src={props.organization.currentOrganization.logo || sampleUrl}
            />
          }
        />
      </Card>
      <List
        itemLayout="horizontal"
        dataSource={props.users}
        renderItem={(item) => (
          <Link to={`/participant/${item._id}`}>
            <Card className="homepage-card name">
              <Meta
                title={`${item.profile.first_name} ${item.profile.last_name}`}
                avatar={<Avatar src={item.profile.photo || sampleUrl} />}
              />
            </Card>
          </Link>
        )}
      />
    </div>
  </div>
);

class Homepage extends React.Component {
  render() {
    const { organization, fieldData, user } = this.props;
    const curOrg = organization.currentOrganization;

    return (
      <React.Fragment>
        <PageHeader
          ghost={true}
          title={curOrg.org_name}
          subTitle={curOrg.org_type}
        >
          <Descriptions size="small" column={2}>
            <Descriptions.Item label="Website">
              {curOrg.social}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {curOrg.location}
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <Tags
          fieldData={fieldData}
          tags={curOrg.tags || []}
          prefix={"organization"}
        />
        <Row className="mt-5">
          <Col md={8} sm={12}></Col>
          <Col md={4} sm={12}>
            <Users {...this.props} />
          </Col>
        </Row>
        {curOrg.creator === user._id && (
          <Row>
            <Col>
              <Link to="/org-profile">Edit Profile</Link>
            </Col>
          </Row>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    organization: state.organization,
    auth: state.auth,
    fieldData: state.profile.fieldData,
    user: state.user.profile,
  };
}

export default connect(mapStateToProps, {})(Homepage);
