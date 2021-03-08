import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Col, Row } from "reactstrap";
import { Button, Modal, Tabs, List, Avatar, Select } from "antd";
import { LeftOutlined, UserOutlined } from "@ant-design/icons";
import { sendInvite, joinOrgProject } from "../../actions/project";
import { Header, Footer } from "../../components/template";
import { listOrgReport } from "../../actions/organization";
import { listMailByOrg } from "../../actions/mail";
import {
  getInviteContent,
  getInviteEmailTemplate,
  getParticipant,
  listOrgByProject,
} from "../../actions/project";
import { fetchUserByEmail } from "../../actions/user";
import { ModalSpinner } from "../../components/pages/spinner";
import UserIcon from "../../assets/img/user-avatar.png";
import { OrgInviteForm, TeamInviteForm } from "./invite-forms";
import { getFieldData } from "../../utils/helper";
import { Link } from "react-router-dom";
import BDImg from "../../assets/icon/building.svg";
import BDWImg from "../../assets/icon/building-white.svg";
import history from "../../history";

const { TabPane } = Tabs;
const { Option } = Select;

class Invite extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      visible: false,
      content: "",
      formVaule: {},
      showExUser: false,
      exUser: {},
      tabkey: "1",
      orgId: "",
    };
  }

  componentDidMount = () => {
    const {
      organization,
      listMailByOrg,
      listOrgReport,
      getParticipant,
      listOrgByProject,
    } = this.props;
    const curProj = this.props.project.project;
    listOrgReport();
    listMailByOrg(organization.currentOrganization._id);
    getParticipant(curProj._id);
    listOrgByProject(curProj._id);
  };

  onSendOrgInvite = async () => {
    this.setState({ loading: true });
    await this.props.sendInvite(this.state.formVaule);
    this.setState({ loading: false });
    this.onHidePreview();
    this.goBack();
  };

  onShowPreview = async (values) => {
    const {
      organization,
      getInviteContent,
      getInviteEmailTemplate,
    } = this.props;
    this.setState({ loading: true });
    values.content = getInviteContent(values);
    values.logo =
      organization.currentOrganization.logo ||
      "https://hackathon-cretech.s3.us-east-2.amazonaws.com/7e68ac9b-cc75-4d15-a8e1-a07a9e48bc90.png";
    values.sender_organization = organization.currentOrganization.org_name;
    const mail = await getInviteEmailTemplate(values);
    this.setState({
      loading: false,
      visible: true,
      content: mail.html,
      formVaule: values,
    });
  };

  onSendTeamInvite = async (values) => {
    const { fetchUserByEmail } = this.props;
    let exUser = await fetchUserByEmail(values.email);
    if (!exUser) {
      await this.onShowPreview(values);
      return;
    }
    this.setState({ showExUser: true, exUser });
  };

  onHideExUserModal = () => {
    this.setState({ showExUser: false, exUser: {} });
  };

  onSendInviteExuser = async () => {
    const curProj = this.props.project.project;
    await this.onJoinOrg(curProj._id, this.state.exUser._id);
    this.onHideExUserModal();
  };

  onJoinOrg = async (projectId, userId, orgId) => {
    const { joinOrgProject, getParticipant, listOrgByProject } = this.props;
    const curProj = this.props.project.project;
    this.setState({ loading: true });
    await joinOrgProject(projectId, userId, orgId);
    await getParticipant(curProj._id);
    await listOrgByProject(curProj._id);
    this.setState({ loading: false });
  };

  onHidePreview = () => {
    this.setState({ visible: false });
  };

  getExMembers = (org_id) => {
    const { organization, project } = this.props;
    const participants = project.participants;
    let members = [],
      result = [];
    const orgReports = organization.adminOrganizations;
    if (!org_id || org_id === "new") return result;
    for (let org of orgReports) {
      if (org._id === org_id) {
        members = org.members;
        break;
      }
    }
    for (let mem of members) {
      if (
        participants.filter((pt) => pt.participant._id === mem._id).length === 0
      ) {
        result.push(mem);
      }
    }
    return result;
  };

  onChangeOrg = (value) => {
    this.setState({ orgId: value });
  };

  renderOrgInviteTab = () => {
    const { organization, project } = this.props;
    const { orgId } = this.state;
    const curProj = project.project;
    const orgReports = organization.adminOrganizations;
    const exMembers = this.getExMembers(orgId);
    return (
      <div className="org-invite-box">
        <h4 className="mb-5">
          <b>Invite a person from another organization</b>
        </h4>
        <Select
          showSearch
          placeholder="Choose the organization..."
          optionFilterProp="children"
          onChange={this.onChangeOrg}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          style={{ width: "100%" }}
          size="large"
          className="mb-5"
        >
          {orgReports.map((item) => (
            <Option key={item._id} value={item._id}>
              {item.org_name}
            </Option>
          ))}
          <Option key={"new"} value={"new"}>
            Another organization
          </Option>
        </Select>
        {exMembers.length > 0 && (
          <List
            itemLayout="horizontal"
            className="project-list"
            dataSource={exMembers}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="ghost"
                    className="black-btn"
                    onClick={() => this.onJoinOrg(curProj._id, item._id, orgId)}
                  >
                    Invite
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.profile.photo || UserIcon} />}
                  title={
                    <b>
                      {item.profile.first_name} {item.profile.last_name}
                    </b>
                  }
                  description={<span>{item.profile.role}</span>}
                />
              </List.Item>
            )}
          />
        )}
        {orgId === "new" && (
          <OrgInviteForm onSubmit={this.onShowPreview} project={curProj} />
        )}
      </div>
    );
  };

  renderTeamInviteTab = () => {
    const { project, organization, fieldData } = this.props;
    const curProj = project.project;
    const curOrg = organization.currentOrganization;
    const exMembers = this.getExMembers(curOrg._id);
    const roles = getFieldData(fieldData, "user_role");
    return (
      <div className="org-invite-box">
        <h4 className="mb-5">
          <b>Invite a person from {curOrg.org_name}</b>
        </h4>
        {exMembers.length > 0 && (
          <List
            itemLayout="horizontal"
            className="project-list"
            dataSource={exMembers}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="ghost"
                    className="black-btn"
                    onClick={() => this.onJoinOrg(curProj._id, item._id)}
                  >
                    Invite
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.profile.photo || UserIcon} />}
                  title={
                    <b>
                      {item.profile.first_name} {item.profile.last_name}
                    </b>
                  }
                  description={<span>{item.profile.role}</span>}
                />
              </List.Item>
            )}
          />
        )}
        <div className="project-teaminvite-box">
          <h5 className="mb-4">
            <b>Cannot find needed person?</b>
          </h5>
          <p style={{ fontSize: "18px" }}>Invite to {curOrg.org_name}</p>
          <TeamInviteForm
            onSubmit={this.onSendTeamInvite}
            project={curProj}
            org={curOrg}
            roles={roles}
          />
        </div>
      </div>
    );
  };

  renderExUser = () => {
    const { exUser } = this.state;
    return (
      <div className="project-exuser-box">
        <Avatar src={exUser.profile.photo || UserIcon} />
        <div className="ml-3">
          <b>
            {exUser.profile.first_name} {exUser.profile.last_name}
          </b>{" "}
          <br />
          <span>organization: {exUser.profile.org_name}</span>
        </div>
      </div>
    );
  };

  onChnageKey = (key) => {
    this.setState({ tabkey: key });
  };

  goBack = () => {
    const { goback, project } = this.props;
    if (goback) goback();
    else {
      history.push(`/project/${project.project._id}`);
    }
  };

  render() {
    const { loading, visible, content, showExUser, tabkey } = this.state;
    return (
      <React.Fragment>
        <Header />
        <div className="account-nav">
          <Container>
            <Link to="#" onClick={this.goBack}>
              <p>
                <LeftOutlined /> Back to Project
              </p>
            </Link>
          </Container>
        </div>
        <Container className="sub-content">
          <Row>
            <Col md={4} className="mb-4">
              <div style={{ maxWidth: "300px" }}>
                <h3 className="mb-4">
                  <b>Invite new project member</b>
                </h3>
                {tabkey === "1" && (
                  <span>
                    You can either invite your organization co-workers, or
                    partners from other organizations.
                  </span>
                )}
                {tabkey === "2" && (
                  <span>
                    Some of the information was prefilled, but there might be
                    some fields you need to complete.
                  </span>
                )}
              </div>
            </Col>
            <Col md={8}>
              <Tabs
                defaultActiveKey={tabkey}
                type="card"
                className="invite-tab"
                onChange={this.onChnageKey}
              >
                <TabPane
                  tab={
                    <span>
                      <img src={tabkey === "1" ? BDImg : BDWImg} alt="" />
                      co-workers
                    </span>
                  }
                  key="1"
                >
                  {this.renderTeamInviteTab()}
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <UserOutlined />
                      partners
                    </span>
                  }
                  key="2"
                >
                  {this.renderOrgInviteTab()}
                </TabPane>
              </Tabs>
              <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
                <Button
                  type="ghost"
                  className="ghost-btn ml-3"
                  onClick={this.goBack}
                >
                  <LeftOutlined /> Back to Project
                </Button>
              </div>
            </Col>
          </Row>

          {visible && (
            <Modal
              title={"Preview Invite Mail"}
              visible={visible}
              width={600}
              footer={false}
              onCancel={this.onHidePreview}
            >
              <div
                style={{ border: "1px solid #4472c4" }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
              <div className="flex mt-4">
                <Button
                  type="primary"
                  onClick={this.onSendOrgInvite}
                  className="mr-4"
                >
                  Send
                </Button>
                <Button onClick={this.onHidePreview}>Cancel</Button>
              </div>
              <ModalSpinner visible={loading} />
            </Modal>
          )}
          {showExUser && (
            <Modal
              title={"There is a user with the email"}
              visible={showExUser}
              width={600}
              footer={false}
              onCancel={this.onHideExUserModal}
            >
              {this.renderExUser()}
              <div className="flex mt-4">
                <Button
                  type="primary"
                  onClick={this.onSendInviteExuser}
                  className="mr-4"
                >
                  Send
                </Button>
                <Button onClick={this.onHideExUserModal}>Cancel</Button>
              </div>
              <ModalSpinner visible={loading} />
            </Modal>
          )}
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    project: state.project,
    organization: state.organization,
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {
  sendInvite,
  joinOrgProject,
  listMailByOrg,
  getInviteContent,
  getInviteEmailTemplate,
  listOrgReport,
  getParticipant,
  listOrgByProject,
  fetchUserByEmail,
})(Invite);
