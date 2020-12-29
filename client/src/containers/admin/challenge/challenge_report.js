import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody } from "reactstrap";
import {
  adminListChallenge,
  deleteChallenge,
  featureChallenge,
} from "../../../actions/challenge";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Skeleton, Modal } from "antd";
import sampleUrl from "../../../assets/icon/challenge.png";
import AdminFeatureAction from "../admin_feature_action";
import EditChallenge from "./challenge-edit";

class ChallengeReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      chlid: "",
    };
  }

  showModal = (chlid) => {
    this.setState({
      visible: true,
      chlid,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
      chlid: "",
    });
  };

  componentDidMount = async () => {
    const { adminListChallenge } = this.props;
    this.setState({ loading: true });
    await adminListChallenge();
    this.setState({ loading: false });
  };

  deleteChallenge = async (id) => {
    await this.props.deleteChallenge(id);
    this.props.adminListChallenge();
  };

  onToggleFeature = async (row, featured) => {
    this.props.featureChallenge(row._id, featured);
  };

  render() {
    const { challenge, label } = this.props;
    const challenges = challenge.adminChallenges || [];
    const { loading, visible, chlid } = this.state;

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
    const adminFormatter = (cell, row) => {
      return (
        <AdminFeatureAction
          onEdit={() => this.showModal(row._id)}
          onDelete={() => this.deleteChallenge(row._id)}
          onToggleFeature={(featured) => this.onToggleFeature(row, featured)}
          featured={row.featured}
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
        dataField: "challenge_name",
        text: `${label.titleChallenge} Name`,
      },
      {
        dataField: "short_description",
        text: "Short Description",
      },
      {
        dataField: "_id",
        text: "ID",
      },
      {
        dataField: "geography",
        text: "Geography",
      },
      {
        dataField: "org_name",
        text: `${label.titleOrganization}`,
      },
      {
        dataField: "benefit",
        text: "Benefit",
      },
      {
        dataField: "projects",
        text: `${label.titleProject}`,
      },
      {
        dataField: "likes",
        text: "Likes",
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
              <h5 className="mr-auto">{label.titleChallenge}</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <Skeleton active loading={loading} />
              <Card>
                <CardBody>
                  <ToolkitProvider
                    bootstrap4
                    keyField="_id"
                    data={challenges}
                    columns={columns}
                    search
                    exportCSV={{
                      onlyExportFiltered: true,
                      exportAll: false,
                      fileName: "challenge-report.csv",
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
              <Modal
                title="Challenge Profile"
                visible={visible}
                width={800}
                footer={false}
                onCancel={this.hideModal}
              >
                {chlid && (
                  <EditChallenge id={chlid} hideModal={this.hideModal} />
                )}
              </Modal>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { challenge: state.challenge, label: state.label };
}

export default connect(mapStateToProps, {
  adminListChallenge,
  deleteChallenge,
  featureChallenge,
})(ChallengeReport);
