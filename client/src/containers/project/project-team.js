import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Button } from "antd";
import { PlusOutlined, MessageOutlined, MailOutlined } from "@ant-design/icons";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { createTeamChat, setChannel } from "../../actions/message";
import UserIcon from "../../assets/img/user-avatar.png";
import history from "../../history";
import { Link } from "react-router-dom";

class ProjectTeam extends Component {
  goTeamChat = async () => {
    const { project, message, createTeamChat, setChannel } = this.props;
    const curProj = project.project;
    let conversations = message.conversations;
    for (let cv of conversations) {
      if (cv.project && cv.project._id === curProj._id) {
        setChannel(cv._id);
        history.push("/messages");
        return;
      }
    }
    const cvId = await createTeamChat(curProj.name, curProj._id);
    setChannel(cvId);
    history.push("/messages");
  };

  onGotoUser = (id) => {
    const { project } = this.props;
    const curProj = project.project;
    history.push(`/user/${id}?project=${curProj._id}`);
  };

  setTableUsers = (users) => {
    let result = [],
      k = 0;
    for (let user of users) {
      if (user.participant && user.participant.profile) {
        let pt = user.participant;
        k++;
        result.push({
          id: k,
          photo: pt.profile.photo,
          name: `${pt.profile.first_name} ${pt.profile.last_name}`,
          role: user.role || "",
          org_name: pt.profile.org_name,
          position: pt.profile.role,
          country: pt.profile.country,
          _id: pt._id,
        });
      }
    }
    return result;
  };

  render = () => {
    const { project, onToggleInvite, onToggleIvMng, isCreator } = this.props;
    const { SearchBar } = Search;
    let users = project.participants;
    users.sort((a, b) => {
      return a.participant.profile.org_name > b.participant.profile.org_name;
    });
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
    const orgFormatter = (cell, row) => (
      <Link className="underline-link" to={`/${cell}`}>
        {cell}
      </Link>
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
        dataField: "org_name",
        text: "ORGANIZATION",
        formatter: orgFormatter,
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
    ];

    return (
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
                {isCreator && (
                  <React.Fragment>
                    <Button
                      type="ghost"
                      className="ghost-btn"
                      onClick={this.goTeamChat}
                    >
                      <MessageOutlined style={{ fontSize: "16px" }} /> start
                      team chat
                    </Button>
                    <Button
                      type="ghost"
                      className="ghost-btn"
                      onClick={onToggleIvMng}
                    >
                      <MailOutlined style={{ fontSize: "16px" }} /> invitations
                    </Button>
                    <Button
                      onClick={onToggleInvite}
                      type="ghost"
                      className="black-btn"
                    >
                      <PlusOutlined /> Add user
                    </Button>
                  </React.Fragment>
                )}
              </Col>
            </Row>
            <BootstrapTable
              {...props.baseProps}
              bordered={false}
              wrapperClasses={`table-responsive team-table table-logo`}
            />
          </React.Fragment>
        )}
      </ToolkitProvider>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    project: state.project,
    message: state.message,
  };
};

export default connect(mapStateToProps, {
  createTeamChat,
  setChannel,
})(ProjectTeam);
