import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import {
  listOrgReport,
  deleteOrganization,
} from "../../../actions/organization";
import { SettingOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Collapse,
  Skeleton,
  Tooltip,
  Tag,
  Input,
  Modal,
  Select,
  message,
  PageHeader,
  Descriptions,
  List,
  Avatar,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import ChallengeIcon from "../../../assets/icon/challenge.png";
import UserIcon from "../../../assets/img/user-avatar.png";
import OrgEdit from "./org-edit";
import { getFieldData } from "../../../utils/helper";

const { Panel } = Collapse;
const { Search } = Input;

class OrgReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      curOrg: {},
      filterType: "",
      searchTxt: "",
    };
  }

  hideModal = () => {
    this.setState({
      visible: false,
      curOrg: {},
    });
  };

  componentDidMount = async () => {
    const { orgs, listOrgReport } = this.props;
    if (!orgs || orgs.length === 0) {
      this.setState({ loading: true });
      await listOrgReport();
      this.setState({ loading: false });
    }
  };

  deleteOrganization = async (id) => {
    await this.props.deleteOrganization(id);
    this.props.listOrgReport();
  };

  onChangeFiltType = (tp) => {
    this.setState({ filterType: tp });
  };

  onChangeSearch = (value) => {
    this.setState({ searchTxt: value });
  };

  filterOrgs = () => {
    const { searchTxt, filterType } = this.state;
    const { orgs } = this.props;
    if (searchTxt && searchTxt.length < 3) {
      message.error("search text shouldn't be less than 3 in length");
      return;
    }
    let filtOrgs = orgs || [];
    if (filterType)
      filtOrgs = orgs.filter((item) => item.org_type === filterType);
    if (searchTxt) {
      let strSch = searchTxt.toLowerCase();
      filtOrgs = filtOrgs.filter((item) => {
        if (item.org_name.toLowerCase().includes(strSch)) return true;
        if (item.location.toLowerCase().includes(strSch)) return true;
        if (item.bio.toLowerCase().includes(strSch)) return true;
        return false;
      });
    }
    return filtOrgs;
  };

  renderDocHeader = (org) => {
    return (
      <span>
        <b className="mr-5">{org.org_name}</b>
        {org.org_type && <Tag color="green">{org.org_type}</Tag>}
      </span>
    );
  };

  genExtra = (org) => (
    <span
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <Tooltip title="Edit">
        <SettingOutlined
          onClick={() => {
            this.setState({
              visible: true,
              curOrg: org,
            });
          }}
        />
      </Tooltip>
      <Tooltip title="Delete">
        <Popconfirm
          title="Are you sure delete this organization?"
          onConfirm={() => this.deleteOrganization(org._id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined className="ml-2" style={{ color: "red" }} />
        </Popconfirm>
      </Tooltip>
    </span>
  );

  renderContent = (org) => (
    <Row>
      <div style={{ flex: 1 }}></div>
      <div className="image">
        <img src={org.logo} alt="content" width="100%" />
      </div>
    </Row>
  );

  render() {
    const { fieldData } = this.props;
    const { loading, visible, curOrg } = this.state;
    const orgTypes = getFieldData(fieldData, "org_type");
    const filtOrgs = this.filterOrgs();
    return (
      <div className="container">
        <Row>
          <Col>
            <h5 className="mr-auto">Organizations</h5>
            <div className="article-filter-box">
              <div>
                <span className="ml-1">text:</span>
                <br />
                <Search
                  onSearch={this.onChangeSearch}
                  style={{ width: 150 }}
                  allowClear
                />
              </div>
              <div>
                <span className="ml-1">type:</span>
                <br />
                <Select
                  style={{ width: 150 }}
                  onChange={this.onChangeFiltType}
                  allowClear
                >
                  {orgTypes.map((item) => {
                    return (
                      <Select.Option key={item._id} value={item.value}>
                        {item.value}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </div>
          </Col>
        </Row>
        <Collapse accordion>
          {filtOrgs.map((org) => (
            <Panel
              header={this.renderDocHeader(org)}
              key={org._id}
              extra={this.genExtra(org)}
            >
              <PageHeader
                title={<Link to={`/${org.org_name}`}>{org.org_name}</Link>}
                className="site-page-header mb-4"
              >
                <Descriptions size="small" column={2}>
                  <Descriptions.Item label="Organization Type">
                    {org.org_type}
                  </Descriptions.Item>
                  <Descriptions.Item label="Location">
                    {org.location}
                  </Descriptions.Item>
                  <Descriptions.Item label="Social">
                    {org.social}
                  </Descriptions.Item>
                  <Descriptions.Item label="Creator">
                    {org.creator &&
                      `${org.creator.profile.first_name} ${org.creator.profile.last_name}`}
                  </Descriptions.Item>
                  <Descriptions.Item label="Bio" className="pt-4">
                    {org.bio}
                  </Descriptions.Item>
                  <Descriptions.Item label="">
                    <div className="supadmin-org-logo">
                      <img src={org.logo || ChallengeIcon} alt="" />
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </PageHeader>
              <span>Users:</span>
              <List
                itemLayout="horizontal"
                dataSource={org.members}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.profile.photo || UserIcon} />}
                      title={
                        <Link to="#">
                          <b>
                            {item.profile.first_name} {item.profile.last_name}
                          </b>
                        </Link>
                      }
                      description={`${item.profile.org_role || "member"} ${
                        item.profile.country || ""
                      }`}
                    />
                  </List.Item>
                )}
              />
            </Panel>
          ))}
        </Collapse>
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        {visible && (
          <Modal
            title={`Organization Profile`}
            visible={visible}
            width={800}
            footer={false}
            onCancel={this.hideModal}
          >
            {curOrg._id && <OrgEdit hideModal={this.hideModal} org={curOrg} />}
          </Modal>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    orgs: state.organization.adminOrganizations,
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, { listOrgReport, deleteOrganization })(
  OrgReport
);
