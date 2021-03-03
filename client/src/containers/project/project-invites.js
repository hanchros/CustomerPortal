import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { Link } from "react-router-dom";
import { Popover, Skeleton, Modal, Button } from "antd";
import { LeftOutlined, MoreOutlined } from "@ant-design/icons";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import moment from "moment";
import { resolveInvite, listInvitesByProject } from "../../actions/invite";
import NonList from "../../components/pages/non-list";
import ExclaimImg from "../../assets/icon/exclaime.svg";
import ProjImg from "../../assets/icon/plates.svg";

class ProjectInviteMng extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      visible: false,
      invite: {},
    };
  }

  componentDidMount = async () => {
    const { project, listInvitesByProject } = this.props;
    const curProj = project.project;
    this.setState({ loading: true });
    await listInvitesByProject(curProj._id);
    this.setState({ loading: false });
  };

  onResolveInvite = async (inv_id) => {
    this.setState({ loading: true });
    await this.props.resolveInvite(inv_id, false);
    this.setState({ loading: false, visible: false });
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

  setTableInvites = (ivs) => {
    let result = [],
      k = 0;
    for (let iv of ivs) {
      k++;
      let ago = moment(iv.createdAt).fromNow();
      ago = ago.replace(" ago", "");
      result.push({
        id: k,
        name: `${iv.first_name} ${iv.last_name}`,
        email: iv.email,
        org_name: iv.organization,
        position: "-",
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
          <li onClick={() => {}}>NOTIFY AGAIN</li>
          <li onClick={() => {}}>EDIT INVITATION</li>
          <li onClick={() => this.setInviteSelect(row)}>CANCEL INVITATION</li>
        </ul>
      </div>
    );
    return (
      <Popover placement="bottomRight" content={content} trigger="click">
        <Link to="#">
          <MoreOutlined />
        </Link>
      </Popover>
    );
  };

  render = () => {
    const { project, goback, invites } = this.props;
    const { loading, visible, invite } = this.state;
    const curProj = project.project;
    const adminFormatter = (cell, row) => {
      return this.renderAction(row);
    };
    const columns = [
      {
        dataField: "name",
        text: "NAME",
        sort: true,
      },
      {
        dataField: "email",
        text: "EMAIL",
        sort: true,
      },
      {
        dataField: "org_name",
        text: "ORGANIZATION",
        sort: true,
      },
      {
        dataField: "position",
        text: "POSITION",
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
        <Header />
        <div className="account-nav">
          <Container>
            <Link to="#" onClick={goback}>
              <p>
                <LeftOutlined /> Go back
              </p>
            </Link>
          </Container>
        </div>
        <Container className="sub-content">
          <div className="flex-colume-center mb-5">
            <h2 className="mb-4" id="title-inv">
              <b>Manage invitations</b>
            </h2>
            <div className="flex" style={{ alignItems: "center" }}>
              <img src={ProjImg} className="mr-3" alt="" height={25} />
              <span style={{ fontSize: "20px" }}>{curProj.name}</span>
            </div>
          </div>
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
          <Skeleton active loading={loading} />
          {this.setTableInvites(invites).length === 0 && (
            <NonList title="You have no invites yet" />
          )}
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
                <p>
                  Note, we are not able to revoke already sent email
                </p>
                <span>
                  <b>{invite.name}</b>
                  <br />
                  might receive an email, but won't be able to use the
                  invitation
                </span>
                <Button
                  type="ghost"
                  className="black-btn mt-5 mb-3"
                  onClick={() => this.onResolveInvite(invite._id)}
                  style={{ width: "100%" }}
                >
                  cancel invitation
                </Button>
                <Button
                  type="ghost"
                  className="ghost-btn"
                  onClick={this.onToggleModal}
                  style={{ width: "100%" }}
                >
                  do not cancel
                </Button>
              </div>
            </Modal>
          )}
        </Container>
        <Footer />
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    project: state.project,
    invites: state.invite.invites,
  };
};

export default connect(mapStateToProps, {
  resolveInvite,
  listInvitesByProject,
})(ProjectInviteMng);
