import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import { Button, Modal, Form, Input, message } from "antd";
import {
  sendSCInvites,
  getInviteContent,
  downloadInvite,
  listSCInvites,
} from "../../../actions/softcompany";
import { getInviteEmailTemplate } from "../../../actions/project";
import { LeftOutlined, FileAddOutlined } from "@ant-design/icons";
import { ModalSpinner } from "../../../components/pages/spinner";
import { extractContent } from "../../../utils/helper";

const SCInviteEditForm = ({ onSubmit, onDownload }) => {
  const [download, setDownload] = useState(false);
  const onFinish = (values) => {
    if (download) onDownload(values);
    else onSubmit(values);
  };

  const onDownloadClick = (e) => {
    setDownload(true);
  };

  const onSendClick = (e) => {
    setDownload(false);
  };

  return (
    <Form name="scinvite" className="org_register" onFinish={onFinish}>
      <Row>
        <Col md={6}>
          <span className="form-label">Company name*</span>
          <Form.Item
            name="organization"
            rules={[
              {
                required: true,
                message: "Please input company name!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col md={6}>
          <span className="form-label">Contact*</span>
          <Form.Item
            name="contact"
            rules={[
              {
                required: true,
                message: "Please input contact name!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <span className="form-label">Company email*</span>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input company email!",
              },
            ]}
          >
            <Input size="large" type="email" />
          </Form.Item>
        </Col>
        <Col md={6}>
          <span className="form-label">Company phone number</span>
          <Form.Item name="phone">
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>
      <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
        <Button
          type="ghost"
          htmlType="submit"
          className="ghost-btn"
          onClick={onDownloadClick}
        >
          <FileAddOutlined />
          generate but not send
        </Button>
        <Button
          type="ghost"
          htmlType="submit"
          className="black-btn ml-3"
          onClick={onSendClick}
        >
          Send Invite
        </Button>
      </div>
    </Form>
  );
};

class SCInviteEdit extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      visible: false,
      content: "",
      formVaule: {},
      showDLModal: false,
    };
  }

  onSendOrgInvite = async () => {
    this.setState({ loading: true });
    await this.props.sendSCInvites(this.state.formVaule);
    await this.props.listSCInvites();
    this.setState({ loading: false });
    this.onHidePreview();
    this.props.goBack();
  };

  onShowPreview = async (values) => {
    const {
      organization,
      getInviteContent,
      getInviteEmailTemplate,
    } = this.props;
    this.setState({ loading: true });
    values.content = getInviteContent(values);
    values.logo = organization.currentOrganization.logo;
    values.sender_organization = organization.currentOrganization.org_name;
    const mail = await getInviteEmailTemplate(values);
    this.setState({
      loading: false,
      visible: true,
      content: mail.html,
      formVaule: values,
    });
  };

  onHidePreview = () => {
    this.setState({ visible: false });
  };

  onHideDLModal = () => {
    this.setState({ showDLModal: false, formVaule: {} });
  };

  onOpenDLModal = (values) => {
    const { getInviteContent, organization } = this.props;
    const content = getInviteContent(values);
    values.content = content;
    values.logo = organization.currentOrganization.logo;
    values.sender_organization = organization.currentOrganization.org_name;
    this.setState({ formVaule: values, showDLModal: true });
  };

  onDownload = async () => {
    const { downloadInvite } = this.props;
    const { formVaule } = this.state;
    this.setState({ loading: true });
    await downloadInvite(formVaule);
    this.setState({ loading: false });
    this.onHideDLModal();
  };

  onCopyLink = () => {
    const { formVaule } = this.state;
    navigator.clipboard.writeText(extractContent(formVaule.content, true));
    message.success("Copied!");
  };

  render = () => {
    const { loading, visible, content, showDLModal, formVaule } = this.state;
    const { goBack } = this.props;
    return (
      <Container>
        <Row className="mt-5">
          <Col md={4}>
            <h3 className="mb-4">
              <b>Invite software company</b>
            </h3>
            <p>
              You can invite a software company to the platform. The company
              will provide all the necessary information after confirming the
              invitation.
            </p>
          </Col>
          <Col md={8}>
            <div className="account-form-box">
              <SCInviteEditForm
                onSubmit={this.onShowPreview}
                onDownload={this.onOpenDLModal}
              />
            </div>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <Button type="ghost" className="ghost-btn" onClick={goBack}>
              <LeftOutlined /> Go back
            </Button>
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
        {showDLModal && (
          <Modal
            title={"Invitation"}
            visible={showDLModal}
            width={600}
            footer={false}
            onCancel={this.onHideDLModal}
          >
            <div
              className="flex mb-4"
              style={{ justifyContent: "space-between" }}
            >
              <h5>
                <b>Copy invite and send it manually</b>
              </h5>
              <Button
                className="ghost-btn"
                type="ghost"
                onClick={this.onCopyLink}
              >
                Copy text
              </Button>
            </div>

            <div
              style={{ backgroundColor: "#f5f7fa", padding: "20px" }}
              dangerouslySetInnerHTML={{ __html: formVaule.content }}
            />
            <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
              <Button
                type="ghost"
                onClick={this.onDownload}
                className="black-btn wide"
              >
                <FileAddOutlined />
                generate but not send
              </Button>
            </div>
            <ModalSpinner visible={loading} />
          </Modal>
        )}
      </Container>
    );
  };
}

function mapStateToProps(state) {
  return {
    organization: state.organization,
  };
}

export default connect(mapStateToProps, {
  sendSCInvites,
  getInviteContent,
  getInviteEmailTemplate,
  downloadInvite,
  listSCInvites,
})(SCInviteEdit);
