import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Input, Button, Modal, Tabs, List, Avatar } from "antd";
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

const { TabPane } = Tabs;

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
    this.props.goback();
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

  getExMembers = () => {
    const { organization, project } = this.props;
    const participants = project.participants;
    let members = [],
      result = [];
    const orgReports = organization.adminOrganizations;
    for (let org of orgReports) {
      if (org._id === organization.currentOrganization._id) {
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

  renderOrgInviteTab = () => {
    const curProj = this.props.project.project;
    return (
      <div className="org-invite-box">
        <p>
          Invite an Organization to participate in {curProj.name}. Once the
          Organization is invited and set-up for the project, additional team
          members can be added to the Organization by using the “Invite Team
          Member” tab.
        </p>
        <OrgInviteForm
          onSubmit={this.onShowPreview}
          project={curProj}
          goback={this.props.goback}
        />
      </div>
    );
  };

  renderTeamInviteTab = () => {
    const { project, organization, fieldData } = this.props;
    const curProj = project.project;
    const exMembers = this.getExMembers();
    const roles = getFieldData(fieldData, "user_role");
    return (
      <div className="org-invite-box">
        <p>
          Invite a Team Member to participate in {curProj.name}. These should be
          members of Organizations that have already been invited to{" "}
          {curProj.name}, if a new Organization needs to be added use the
          “Invite Organization” tab.
        </p>
        <div className="org-invite-header">
          <Input
            type="text"
            value={organization.currentOrganization.org_name}
            disabled
          />
        </div>
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
                  description={<span>{item.profile.org_role}</span>}
                />
              </List.Item>
            )}
          />
        )}
        <div className="project-teaminvite-box">
          <p>Invite new member</p>
          <TeamInviteForm
            onSubmit={this.onSendTeamInvite}
            project={curProj}
            org={organization.currentOrganization}
            roles={roles}
            goback={this.props.goback}
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

  render() {
    const { loading, visible, content, showExUser } = this.state;
    const { invite } = this.props;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Tabs
            defaultActiveKey={invite === "team" ? "2" : "1"}
            type="card"
            className="invite-tab mb-5"
          >
            <TabPane tab="Invite Organization" key="1">
              {this.renderOrgInviteTab()}
            </TabPane>
            <TabPane tab="Invite Team Member" key="2">
              {this.renderTeamInviteTab()}
            </TabPane>
          </Tabs>
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
