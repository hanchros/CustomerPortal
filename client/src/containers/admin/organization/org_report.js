import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody } from "reactstrap";
import {
  listOrgReport,
  deleteOrganization,
} from "../../../actions/organization";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Skeleton, Modal } from "antd";
import sampleUrl from "../../../assets/icon/challenge.png";
import AdminAction from "../admin_action";
import OrgEdit from "./org-edit";

class OrgReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      orgid: "",
    };
  }

  showModal = (orgid) => {
    this.setState({
      visible: true,
      orgid,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
      orgid: "",
    });
  };

  componentDidMount = async () => {
    const { organization, listOrgReport } = this.props;
    if (
      !organization.adminOrganizations ||
      organization.adminOrganizations.length === 0
    ) {
      this.setState({ loading: true });
      await listOrgReport();
      this.setState({ loading: false });
    }
  };

  deleteOrganization = async (id) => {
    await this.props.deleteOrganization(id);
    this.props.listOrgReport();
  };

  render() {
    const { organization } = this.props;
    const organizations = organization.adminOrganizations || [];
    const { loading, visible, orgid } = this.state;

    const { SearchBar } = Search;
    const { ExportCSVButton } = CSVExport;
    const paginationOptions = {
      paginationSize: 10,
      pageStartIndex: 1,
      firstPageText: "First",
      prePageText: "Back",
      nextPageText: "Next",
      lastPageText: "Last",
      nextPageTitle: "First page",
      prePageTitle: "Pre page",
      firstPageTitle: "Next page",
      lastPageTitle: "Last page",
      showTotal: true,
      sizePerPageList: [
        {
          text: "5",
          value: 5,
        },
        {
          text: "10",
          value: 10,
        },
        {
          text: "20",
          value: 20,
        },
        {
          text: "100",
          value: 100,
        },
      ],
    };

    const photoFormatter = (cell, row) => {
      return <img className="table-photo" src={cell || sampleUrl} alt="" />;
    };

    const creatorFormatter = (cell, row) => {
      if (!cell || !cell._id) return "";
      return `${cell.profile.first_name} ${cell.profile.last_name}`;
    };

    const adminFormatter = (cell, row) => {
      return (
        <AdminAction
          onEdit={() => this.showModal(row._id)}
          onDelete={() => this.deleteOrganization(row.id)}
        />
      );
    };

    const columns = [
      {
        dataField: "logo",
        text: "Photo",
        formatter: photoFormatter,
      },
      {
        dataField: "org_name",
        text: `Organization_Name`,
      },
      {
        dataField: "_id",
        text: "ID",
      },
      {
        dataField: "org_type",
        text: "Organization_Type",
      },
      {
        dataField: "location",
        text: "Location",
      },
      {
        dataField: "social",
        text: "Social_Link",
      },
      {
        dataField: "members",
        text: "Members",
      },
      {
        dataField: "creator",
        text: "Creator",
        formatter: creatorFormatter,
      },
      {
        dataField: "",
        text: "Action",
        formatter: adminFormatter,
      },
    ];

    return (
      <React.Fragment>
        <div className="content">
          <Row>
            <Col className="flex">
              <h5 className="mr-auto">Organization</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <Skeleton active loading={loading} />
              <Card>
                <CardBody>
                  <ToolkitProvider
                    bootstrap4
                    keyField="id"
                    data={organizations}
                    columns={columns}
                    search
                    exportCSV={{
                      onlyExportFiltered: true,
                      exportAll: false,
                      fileName: "org-report.csv",
                    }}
                  >
                    {(props) => (
                      <React.Fragment>
                        <Row>
                          <Col className="flex">
                            <SearchBar {...props.searchProps} />
                          </Col>
                          <Col className="text-right">
                            <ExportCSVButton
                              {...props.csvProps}
                              className="btn btn-primary"
                            >
                              Export CSV
                            </ExportCSVButton>
                          </Col>
                        </Row>
                        <BootstrapTable
                          {...props.baseProps}
                          bordered={false}
                          wrapperClasses={`table-responsive data-table-1 mb-1`}
                          pagination={paginationFactory(paginationOptions)}
                        />
                      </React.Fragment>
                    )}
                  </ToolkitProvider>
                </CardBody>
              </Card>
            </Col>
            <Modal
              title={`Organization Profile`}
              visible={visible}
              width={800}
              footer={false}
              onCancel={this.hideModal}
            >
              {orgid && <OrgEdit id={orgid} hideModal={this.hideModal} />}
            </Modal>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { organization: state.organization };
}

export default connect(mapStateToProps, { listOrgReport, deleteOrganization })(
  OrgReport
);
