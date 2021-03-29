import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Skeleton } from "antd";
import { listSCInvites, listCompanies } from "../../../actions/softcompany";
import { listMailGlobal } from "../../../actions/mail";
import {
  resolveInvite,
  notifyInvite,
  editInvite,
} from "../../../actions/invite";
import InviteForm from "./invite_form";
import InviteManage from "./invite_manage";
import OrgLogo from "../../../assets/icon/challenge.png";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

class SoftwareCompany extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showInvite: false,
      loading: false,
    };
  }

  componentDidMount = async () => {
    const { listMailGlobal, listSCInvites, listCompanies } = this.props;
    this.setState({ loading: true });
    await listMailGlobal();
    await listSCInvites();
    await listCompanies();
    this.setState({ loading: false });
  };

  toggleInviteForm = () => {
    this.setState({ showInvite: !this.state.showInvite });
  };

  setTableUsers = (companies) => {
    let result = [],
      k = 0;
    for (let comp of companies) {
      k++;
      result.push({
        id: k,
        logo: comp.profile.logo,
        org_name: comp.profile.org_name,
        org_type: comp.profile.org_type,
        contact: comp.profile.contact,
        phone: comp.profile.phone,
        address: comp.profile.address,
        _id: comp._id,
      });
    }
    return result;
  };

  render() {
    const { softcompany } = this.props;
    const { showInvite, loading } = this.state;
    if (showInvite) {
      return <InviteForm goBack={this.toggleInviteForm} />;
    }
    const companies = softcompany.softcompanies;
    const { SearchBar } = Search;
    const photoFormatter = (cell, row) => {
      return <img className="table-photo" src={cell || OrgLogo} alt="" />;
    };
    const columns = [
      {
        dataField: "logo",
        text: "LOGO",
        formatter: photoFormatter,
      },
      {
        dataField: "org_name",
        text: "NAME",
        sort: true,
      },
      {
        dataField: "org_type",
        text: "Type",
        sort: true,
      },
      {
        dataField: "contact",
        text: "CONTACT",
        sort: true,
      },
      {
        dataField: "phone",
        text: "PHONE",
        sort: true,
      },
      {
        dataField: "address",
        text: "ADDRESS",
        sort: true,
      },
    ];
    return (
      <div className="container">
        <h5 className="mr-auto mb-4 mt-4">
          <b>Software companies</b>
        </h5>
        <ToolkitProvider
          bootstrap4
          keyField="id"
          data={this.setTableUsers(companies)}
          columns={columns}
          search
        >
          {(props) => (
            <React.Fragment>
              <Row>
                <Col className="table-header-btns">
                  <SearchBar {...props.searchProps} />
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
        <Skeleton active loading={loading} />
        <hr className="mt-5 mb-5" />
        <h5 className="mr-auto mb-4">
          <b>Invitations</b>
        </h5>
        <Skeleton active loading={loading} />
        <InviteManage onShowInvite={this.toggleInviteForm} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    invite: state.invite,
    softcompany: state.softcompany,
  };
}

export default connect(mapStateToProps, {
  listSCInvites,
  listMailGlobal,
  resolveInvite,
  notifyInvite,
  editInvite,
  listCompanies,
})(SoftwareCompany);
