import React from "react";
import { Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { Avatar, Card, List, Tag, PageHeader, Descriptions, Alert } from "antd";
import { ChallengeCard } from "../template";
import { Link } from "react-router-dom";
import sampleUrl from "../../assets/img/user-avatar.png";
import Tags from "../pages/tags";
import AttrBlock from "../pages/attr-block";

const { Meta } = Card;

const Challenges = (props) => (
  <div className="list-view">
    <h5>
      {props.label.titleChallenge} created by {props.name}
    </h5>
    <Row className="mb-5">
      {props.challenges.map((item, index) => {
        return (
          <Col key={index} xl={4} lg={6} sm={12}>
            <Link className="card-link" to={`/challenge/${item._id}`}>
              <ChallengeCard
                key={index}
                item={item}
                button={false}
                label={props.label}
              />
            </Link>
            {props.authUser && props.onClickUpdate && (
              <div className="edit-chal">
                <Tag color="purple" onClick={() => props.onClickUpdate(item)}>
                  Edit {props.label.titleChallenge}
                </Tag>
              </div>
            )}
          </Col>
        );
      })}
      {props.onClickCreate ? (
        <Col xl={4} lg={6} sm={12}>
          <ChallengeCard
            button={true}
            onClickCreate={props.onClickCreate}
            label={props.label}
          />
        </Col>
      ) : null}
    </Row>
  </div>
);

const Users = (props) => (
  <div className="list-view">
    <Row>
      <Col>
        <h5>
          {props.label.titleParticipant} from {props.name}
        </h5>
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
  renderProfileAlert = (org) => {
    if (!org) return null;
    let message = [];
    if (!org.org_type) message.push("org_type");
    if (!org.country) message.push("country");
    if (!org.address) message.push("address");
    if (message.length === 0) return null;
    const valid = (
      <div className="profile-alert">
        {this.props.label.titleOrganization} Profile has not been completed!
        Click <Link to="/org-profile">here</Link> to update the profile
      </div>
    );
    return <Alert description={valid} type="info" closable />;
  };

  render() {
    const { auth, organization, challenge, fieldData } = this.props;
    let authUser = false;
    if (
      auth.loginMode === 1 &&
      organization.authOrg.org_name === this.props.name
    ) {
      authUser = true;
    }
    const curOrg = organization.currentOrganization;

    return (
      <React.Fragment>
        {this.renderProfileAlert(curOrg)}
        <PageHeader
          ghost={true}
          title={curOrg.org_name}
          subTitle={curOrg.org_type}
        >
          <Descriptions size="small" column={2}>
            <Descriptions.Item label="Website">
              {curOrg.website}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {curOrg.country}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {curOrg.address}
            </Descriptions.Item>
            <Descriptions.Item label="City">
              {curOrg.state} {curOrg.city}
            </Descriptions.Item>
            <Descriptions.Item label="Contact Email">
              {curOrg.contact_email}
            </Descriptions.Item>
            <Descriptions.Item label="Contact Phone">
              {curOrg.contact_phone}
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <Tags
          fieldData={fieldData}
          tags={curOrg.tags || []}
          prefix={"organization"}
        />
        <AttrBlock
          fieldData={fieldData}
          fieldName={"orgform_attr"}
          attr={curOrg.attr}
        />
        <Row className="mt-5">
          <Col md={8} sm={12}>
            <Challenges
              {...this.props}
              authUser={authUser}
              challenges={challenge.challenges}
            />
          </Col>
          <Col md={4} sm={12}>
            <Users {...this.props} />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    organization: state.organization,
    challenge: state.challenge,
    auth: state.auth,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
}

export default connect(mapStateToProps, {})(Homepage);
