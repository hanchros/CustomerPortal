import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Tabs,
  List,
  Avatar,
  Row,
  Col,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { sendInvite, joinOrgProject } from "../../actions/project";
import { Header, Footer } from "../../components/template";
import { listSimpleOrg, listOrgReport } from "../../actions/organization";
import { listMailByOrg } from "../../actions/mail";
import {
  getInviteContent,
  getInviteEmailTemplate,
  getParticipant,
  listOrgByProject,
} from "../../actions/project";
import { ModalSpinner } from "../../components/pages/spinner";
import ChallengeLogo from "../../assets/icon/challenge.png";
import UserIcon from "../../assets/img/user-avatar.png";

const { TabPane } = Tabs;

const OrgInviteForm = ({ onSubmit, project }) => {
  const onFinish = (values) => {
    values.project_name = project.name;
    values.project_id = project._id;
    onSubmit(values);
  };
  return (
    <Form name="invite" className="register-form" onFinish={onFinish}>
      <span>Organization name:</span>
      <Form.Item
        name="organization"
        rules={[
          {
            required: true,
            message: "Please input the organization!",
          },
        ]}
      >
        <Input size="large" placeholder="Organization" />
      </Form.Item>
      <span>Leader:</span>
      <Form.Item
        name="first_name"
        rules={[
          {
            required: true,
            message: "Please input first name!",
          },
        ]}
      >
        <Input size="large" placeholder="First Name" />
      </Form.Item>
      <Form.Item
        name="last_name"
        rules={[
          {
            required: true,
            message: "Please input last name!",
          },
        ]}
      >
        <Input size="large" placeholder="Last Name" />
      </Form.Item>
      <span>E-mail:</span>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input size="large" type="email" placeholder="E-mail" />
      </Form.Item>
      <div className="signup-btn mt-4">
        <button type="submit" className="main-btn template-btn">
          Invite
        </button>
      </div>
    </Form>
  );
};

class Invite extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      visible: false,
      content: "",
      formVaule: {},
      selectedOrg: {},
      isNewOrg: false,
    };
  }

  componentDidMount = () => {
    const {
      organization,
      listSimpleOrg,
      listMailByOrg,
      listOrgReport,
      getParticipant,
      listOrgByProject,
    } = this.props;
    const curProj = this.props.project.project;
    listSimpleOrg();
    listOrgReport();
    listMailByOrg(organization.currentOrganization._id);
    getParticipant(curProj._id);
    listOrgByProject(curProj._id);
  };

  onSendOrgInvite = async () => {
    this.setState({ loading: true });
    await this.props.sendInvite(this.state.formVaule);
    this.setState({ loading: false, isNewOrg: false });
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

  renderExInvites = () => {
    const { project } = this.props;
    const participants = project.participants;
    const organizations = project.organizations;
    return (
      <Row gutter={30}>
        <Col md={12} sm={24}>
          <div className="project-detail-clients mb-4">
            <span>Client & Partner Organization:</span>
            <List
              itemLayout="horizontal"
              className="project-list"
              dataSource={organizations}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={item.organization.logo || ChallengeLogo} />
                    }
                    title={<b>{item.organization.org_name}</b>}
                    description={
                      <span>
                        {item.organization.org_type || ""}{" "}
                        {item.organization.location || ""}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </Col>
        <Col md={12} sm={24}>
          <div className="project-detail-clients mb-4">
            <span>Team:</span>
            <List
              itemLayout="horizontal"
              className="project-list"
              dataSource={participants}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.participant.profile.photo || UserIcon}
                      />
                    }
                    title={
                      <b>
                        {item.participant.profile.first_name}{" "}
                        {item.participant.profile.last_name}
                      </b>
                    }
                    description={
                      <span>{item.participant.profile.org_name || ""}</span>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
    );
  };

  getExOrgs = () => {
    const { organization, project } = this.props;
    const projOrgs = project.organizations;
    const orgReports = organization.adminOrganizations;
    let result = [];
    for (let org of orgReports) {
      let filtOrgs = projOrgs.filter(
        (item) => item.organization._id === org._id
      );
      if (filtOrgs.length > 0) result.push(org);
    }
    return result;
  };

  onSelectOrg = (orgId) => {
    const { organization } = this.props;
    const orgReports = organization.adminOrganizations;
    for (let org of orgReports) {
      if (org._id === orgId) {
        this.setState({ selectedOrg: org });
        break;
      }
    }
    this.setState({ isNewOrg: false });
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
        <OrgInviteForm onSubmit={this.onShowPreview} project={curProj} />
      </div>
    );
  };

  renderTeamInviteTab = () => {
    const { selectedOrg } = this.state;
    const exOrgs = this.getExOrgs();
    const curProj = this.props.project.project;
    return (
      <div className="org-invite-box">
        <p>
          Invite a Team Member to participate in {curProj.name}. These should be
          members of Organizations that have already been invited to{" "}
          {curProj.name}, if a new Organization needs to be added use the
          “Invite Organization” tab.
        </p>
        <div className="org-invite-header">
          <Select placeholder="Organization" onChange={this.onSelectOrg}>
            {exOrgs.map((item) => (
              <Select.Option key={item._id} value={item._id}>
                {item.org_name}
              </Select.Option>
            ))}
          </Select>
        </div>
        {selectedOrg.members && selectedOrg.members.length > 0 && (
          <List
            itemLayout="horizontal"
            className="project-list"
            dataSource={selectedOrg.members}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <button
                    className="main-btn"
                    onClick={() => this.onJoinOrg(curProj._id, item._id)}
                  >
                    Invite
                  </button>,
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
      </div>
    );
  };

  render() {
    const { loading, visible, content } = this.state;
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
          {this.renderExInvites()}
          <Button className="mt-4" type="link" onClick={this.props.goback}>
            <ArrowLeftOutlined /> Back
          </Button>
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
  };
}

export default connect(mapStateToProps, {
  sendInvite,
  listSimpleOrg,
  joinOrgProject,
  listMailByOrg,
  getInviteContent,
  getInviteEmailTemplate,
  listOrgReport,
  getParticipant,
  listOrgByProject,
})(Invite);
