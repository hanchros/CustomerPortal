import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import UserIcon from "../../assets/img/user-avatar.png";
import history from "../../history";
import { Link } from "react-router-dom";

class OrgUsers extends Component {
  goToUser = (id) => {
    history.push(`/user/${id}`);
  };

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
        projects: user.projects,
        _id: user._id,
      });
    }
    return result;
  };

  render = () => {
    const { users, onToggleInvite } = this.props;
    const { SearchBar } = Search;
    const photoFormatter = (cell, row) => {
      return <img className="table-photo" src={cell || UserIcon} alt="" />;
    };
    const projectFormatter = (cell, row) => {
      if (!cell || cell.length === 0) return "-";
      let projs = cell.filter(
        (pr) => pr.role.toLowerCase() === "creator" && !!pr.project
      );
      return (
        <React.Fragment>
          {projs.map((pr, index) => (
            <span key={index}>
              {index !== 0 && <span>, </span>}
              <Link
                className="underline-link"
                to={`/project/${pr.project._id}`}
              >
                {pr.project.name}
              </Link>
            </span>
          ))}
        </React.Fragment>
      );
    };
    const nameFormatter = (cell, row) => (
      <span
        onClick={() => this.goToUser(row._id)}
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
        dataField: "projects",
        text: "PROJECTS",
        formatter: projectFormatter,
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
                {onToggleInvite && (
                  <Button
                    onClick={onToggleInvite}
                    type="ghost"
                    className="black-btn"
                  >
                    <PlusOutlined /> Add user
                  </Button>
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

export default OrgUsers;
