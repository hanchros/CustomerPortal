import React, { Component } from "react";
import { connect } from "react-redux";
import { Popover, Modal, Button, Form, Input } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import moment from "moment";
import { resolveInvite } from "../../../actions/invite";
import {
  listSCInvites,
  notifyInvite,
  editInvite,
} from "../../../actions/softcompany";
import ExclaimImg from "../../../assets/icon/exclaime.svg";
import NonList from "../../../components/pages/non-list";
import { ModalSpinner } from "../../../components/pages/spinner";

const EditInviteForm = ({ onSubmit, invite, onCancel }) => {
  const onFinish = async (values) => {
    onSubmit(invite._id, values.email);
    onCancel();
  };

  const onCancelEdit = (e) => {
    e.preventDefault();
    onCancel();
  };

  return (
    <Form
      name="create-note"
      className="mt-4 register-form p-3"
      onFinish={onFinish}
      initialValues={{ email: invite.email }}
    >
      <div className="center">
        <h2>
          <b>Edit invitation</b>
        </h2>
      </div>
      <div className="invite-edit-info mt-5">
        <span>Name</span>
        <span> {invite.name} </span>
      </div>
      <div className="invite-edit-info">
        <span>Organization</span>
        <span>{invite.org_name}</span>
      </div>
      <span className="form-label">Email*</span>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: `Please input the email!`,
          },
        ]}
      >
        <Input type="email" size="large" />
      </Form.Item>
      <Button
        type="ghost"
        htmlType="submit"
        className="black-btn wide mt-5"
        style={{ width: "100%" }}
      >
        send invite to a new email
      </Button>
      <Button
        type="ghost"
        onClick={onCancelEdit}
        className="ghost-btn wide mt-3"
        style={{ width: "100%" }}
      >
        Cancel
      </Button>
    </Form>
  );
};

class SoftwareCompany extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      invite: {},
      modalLoading: false,
      showEditModal: false,
    };
  }

  onResolveInvite = async (inv_id) => {
    this.setState({ modalLoading: true });
    await this.props.resolveInvite(inv_id, false);
    await this.props.listSCInvites();
    this.setState({ modalLoading: false, visible: false });
  };

  onToggleModal = () => {
    this.setState({ visible: !this.state.visible });
  };

  setInviteSelect = (row) => {
    this.setState({
      invite: row,
      visible: true,
    });
  };

  onNotifyInvite = async (row) => {
    this.setState({ modalLoading: true });
    await this.props.notifyInvite(row._id);
    await this.props.listSCInvites();
    this.setState({ modalLoading: false });
  };

  onEditInvite = async (id, email) => {
    this.setState({ modalLoading: true });
    await this.props.editInvite(id, email);
    await this.props.listSCInvites();
    this.setState({ modalLoading: false });
  };

  openEditModal = (row) => {
    this.setState({
      invite: row,
      showEditModal: true,
    });
  };

  hideEditModal = () => {
    this.setState({
      invite: {},
      showEditModal: false,
    });
  };

  setTableInvites = (ivs) => {
    let result = [],
      k = 0;
    for (let iv of ivs) {
      k++;
      let ago = moment(iv.createdAt).fromNow();
      ago = ago.replace(" ago", "");
      result.push({
        id: k,
        name: iv.first_name,
        email: iv.email,
        org_name: iv.organization,
        wait_time: ago,
        _id: iv._id,
      });
    }
    return result;
  };

  renderAction = (row) => {
    let content = (
      <div className="blue-popover">
        <ul>
          <li onClick={() => this.onNotifyInvite(row)}>NOTIFY AGAIN</li>
          <li onClick={() => this.openEditModal(row)}>EDIT INVITATION</li>
          <li onClick={() => this.setInviteSelect(row)}>CANCEL INVITATION</li>
        </ul>
      </div>
    );
    return (
      <Popover className="more-popover" placement="bottomRight" content={content} trigger="click">
        <Link to="#">
          <MoreOutlined />
        </Link>
      </Popover>
    );
  };

  render() {
    const { invites, onShowInvite } = this.props;
    const { visible, invite, modalLoading, showEditModal } = this.state;
    const adminFormatter = (cell, row) => {
      return this.renderAction(row);
    };
    const columns = [
      {
        dataField: "org_name",
        text: "COMPANY",
        sort: true,
      },
      {
        dataField: "email",
        text: "EMAIL",
        sort: true,
      },
      {
        dataField: "name",
        text: "CONTACT",
        sort: true,
      },
      {
        dataField: "wait_time",
        text: "WAITING TIME",
        sort: true,
      },
      {
        dataField: "",
        text: "",
        formatter: adminFormatter,
      },
    ];
    return (
      <React.Fragment>
        {invites && invites.length > 0 && (
          <ToolkitProvider
            bootstrap4
            keyField="id"
            data={this.setTableInvites(invites)}
            columns={columns}
          >
            {(props) => (
              <BootstrapTable
                {...props.baseProps}
                bordered={false}
                wrapperClasses={`table-responsive team-table with-action`}
              />
            )}
          </ToolkitProvider>
        )}
        {this.setTableInvites(invites).length === 0 && (
          <NonList title="You have no invites yet" />
        )}
        <Button type="ghost" onClick={onShowInvite} className="black-btn mt-5">
          Send invite
        </Button>
        {visible && (
          <Modal
            visible={visible}
            width={450}
            footer={false}
            onCancel={this.onToggleModal}
            centered
          >
            <div className="confirm-file-read">
              <img src={ExclaimImg} alt="" />
              <p>Note, we are not able to revoke already sent email</p>
              <span>
                <b>{invite.name}</b>
                <br />
                might receive an email, but won't be able to use the invitation
              </span>
              <Button
                type="ghost"
                className="black-btn wide mt-5 mb-3"
                onClick={() => this.onResolveInvite(invite._id)}
                style={{ width: "100%" }}
              >
                cancel invitation
              </Button>
              <Button
                type="ghost"
                className="ghost-btn wide"
                onClick={this.onToggleModal}
                style={{ width: "100%" }}
              >
                do not cancel
              </Button>
            </div>
          </Modal>
        )}
        {showEditModal && (
          <Modal
            visible={showEditModal}
            width={500}
            footer={false}
            onCancel={this.hideEditModal}
            centered
          >
            <EditInviteForm
              invite={invite}
              onCancel={this.hideEditModal}
              onSubmit={this.onEditInvite}
            />
          </Modal>
        )}
        <ModalSpinner visible={modalLoading} />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    invites: state.invite.scinvites,
  };
}

export default connect(mapStateToProps, {
  resolveInvite,
  notifyInvite,
  editInvite,
  listSCInvites,
})(SoftwareCompany);
