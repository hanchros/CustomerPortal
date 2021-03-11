import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Row, Col } from "reactstrap";
import { Button, Popconfirm, Popover, Skeleton } from "antd";
import { PlusOutlined, MailOutlined, MoreOutlined } from "@ant-design/icons";
import {
  listOrgUsers,
  addOrgUser,
  removeOrgUser,
  changeUserOrgRole,
} from "../../../actions/organization";
import UserIcon from "../../../assets/img/user-avatar.png";
import history from "../../../history";
import InvitePage from "../../organization/invite";

class AdminUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showInviteForm: false,
    };
  }

  componentDidMount = async () => {
    const { listOrgUsers, organization } = this.props;
    this.setState({ loading: true });
    await listOrgUsers(organization.currentOrganization._id);
    this.setState({ loading: false });
  };

  onToggleShowInvite = () => {
    this.setState({
      showInviteForm: !this.state.showInviteForm,
    });
  };

  onChangeRole = (role) => {
    this.setState({ curRole: role });
  };

  onRemoveUser = async (id) => {
    const { removeOrgUser, organization, listOrgUsers } = this.props;
    this.setState({ loading: true });
    await removeOrgUser(id);
    await listOrgUsers(organization.currentOrganization._id);
    this.setState({ loading: false });
  };

  onAddUser = async (id) => {
    const { addOrgUser, organization } = this.props;
    const org = organization.currentOrganization;
    await addOrgUser(id, org._id);
  };

  onGotoUser = (id) => {
    history.push(`/user/${id}`);
  };

  // onSaveChangeRole = async () => {
  //   const { curRole, curUser } = this.state;
  //   const org = this.props.organization.currentOrganization;
  //   await this.props.changeUserOrgRole(curUser._id, curRole);
  //   listOrgUsers(org._id);
  // };

  setTableUsers = (users) => {
    let result = [],
      k = 0;
    for (let user of users) {
      k++;
      result.push({
        id: k,
        photo: user.profile.photo,
        name: `${user.profile.first_name} ${user.profile.last_name}`,
        role: user.profile.org_role || "-",
        position: user.profile.role,
        country: user.profile.country,
        _id: user._id,
      });
    }
    return result;
  };

  renderAction = (cell, row) => {
    let content = (
      <div className="blue-popover">
        <ul>
          <li onClick={() => {}}>EDIT USER</li>
          <li>
            <Popconfirm
              title="Are you sure remove this user?"
              onConfirm={() => this.onRemoveUser(row._id)}
              okText="Yes"
              cancelText="No"
            >
              REMOVE USER
            </Popconfirm>
          </li>
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

  render() {
    const { organization } = this.props;
    const { showInviteForm, loading } = this.state;
    const { SearchBar } = Search;
    let users = organization.users;
    const photoFormatter = (cell, row) => {
      return <img className="table-photo" src={cell || UserIcon} alt="" />;
    };
    const nameFormatter = (cell, row) => (
      <span
        onClick={() => this.onGotoUser(row._id)}
        style={{ cursor: "pointer" }}
      >
        <b>{cell}</b>
      </span>
    );
    const columns = [
      {
        dataField: "photo",
        text: "",
        formatter: photoFormatter,
      },
      {
        dataField: "name",
        text: "NAME",
        formatter: nameFormatter,
        sort: true,
      },
      {
        dataField: "role",
        text: "ROLE",
        sort: true,
      },
      {
        dataField: "position",
        text: "POSITION",
        sort: true,
      },
      {
        dataField: "country",
        text: "LOCATION",
        sort: true,
      },
      {
        dataField: "",
        text: "",
        formatter: this.renderAction,
      },
    ];

    if (showInviteForm) return <InvitePage goBack={this.onToggleShowInvite} />;

    return (
      <React.Fragment>
        <h3>
          <b>Users</b>
        </h3>
        <hr className="mt-4 mb-4" />
        <Skeleton active loading={loading} />
        <ToolkitProvider
          bootstrap4
          keyField="id"
          data={this.setTableUsers(users)}
          columns={columns}
          search
        >
          {(props) => (
            <React.Fragment>
              <Row>
                <Col className="table-header-btns">
                  <SearchBar {...props.searchProps} />
                  <React.Fragment>
                    <Button
                      type="ghost"
                      className="ghost-btn"
                      onClick={() => {}}
                    >
                      <MailOutlined style={{ fontSize: "16px" }} /> invitations
                    </Button>
                    <Button
                      onClick={this.onToggleShowInvite}
                      type="ghost"
                      className="black-btn"
                    >
                      <PlusOutlined /> Add user
                    </Button>
                  </React.Fragment>
                </Col>
              </Row>
              <BootstrapTable
                {...props.baseProps}
                bordered={false}
                wrapperClasses={`table-responsive team-table with-action`}
              />
            </React.Fragment>
          )}
        </ToolkitProvider>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    organization: state.organization,
  };
}

export default connect(mapStateToProps, {
  listOrgUsers,
  removeOrgUser,
  addOrgUser,
  changeUserOrgRole,
})(AdminUsers);
