import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Skeleton, Input, Button, Checkbox, Tag, Select, Popover } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import { FilterOutlined, CaretDownOutlined } from "@ant-design/icons";
import { listOrganization, clearSearch } from "../../actions/organization";
import { Header, Footer, CustomCard } from "../../components/template";
import ProjectAvatar from "../../assets/icon/challenge.png";
import Spinner from "../../components/pages/spinner";
import { createNotification } from "../../actions";
import {
  getFieldData,
  getTargetFieldName,
  getTargetLabelFromSection,
  getOneFieldData,
  getFieldDataById,
} from "../../utils/helper";

const { Option } = Select;

class OrganizationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      searchStr: props.organization.searchTxt,
    };
  }

  componentDidMount = async () => {
    const { organization, listOrganization } = this.props;
    const orgs = organization.organizations;
    if (!orgs || orgs.length === 0) {
      this.setState({ loading: true });
      await listOrganization(0, this.state);
      this.setState({ loading: false });
    }
  };

  onChangeSearch = (e) => {
    this.setState({ searchStr: e.target.value });
  };

  onSearch = (value) => {
    if (value && value.length < 3) {
      createNotification(
        `Search ${this.props.label.titleOrganization}`,
        "Search text should be at least 3 in length"
      );
      this.setState({ searchStr: value });
      return;
    }
    this.setState({ searchStr: value }, () => this.onApplyFilter());
  };

  loadMore = () => {
    const { organization, listOrganization } = this.props;
    if (organization.organizations.length < 16) return;
    listOrganization(organization.organizations.length, this.state);
  };

  refreshOrganization = () => {
    const namelist = getTargetFieldName("organization", this.props.fieldData);
    let state = this.state;
    for (let name of namelist) {
      state[name] = [];
    }
    state.searchStr = "";
    state.filter_sort = "";
    this.setState(state, () => this.onApplyFilter());
  };

  mkOptions = (list) => {
    let newList = list.map((item) => {
      return { label: item.value, value: item._id };
    });
    return newList;
  };

  onChangeFilter = (name, values) => {
    this.setState({ [name]: values }, this.onApplyFilter);
  };

  handleRemoveFilter = (tag) => {
    let stateTags = this.state[tag.field];
    for (let i = stateTags.length - 1; i >= 0; i--) {
      if (stateTags[i] === tag._id) {
        stateTags.splice(i, 1);
      }
    }
    this.setState({ [tag.field]: stateTags }, this.onApplyFilter);
  };

  handleRemoveSearchStr = () => {
    this.setState({ searchStr: "" }, this.onApplyFilter);
  };

  onApplyFilter = () => {
    this.props.clearSearch();
    this.props.listOrganization(0, this.state);
  };

  mkContent = (name) => {
    const list = getFieldData(this.props.fieldData, name);
    return (
      <div>
        <Checkbox.Group
          className="chk-gallery-filter"
          options={this.mkOptions(list)}
          value={this.state[name]}
          onChange={(values) => this.onChangeFilter(name, values)}
        />
      </div>
    );
  };

  renderSelectedFilters = () => {
    const { fieldData } = this.props;
    const { searchStr } = this.state;
    let tags = [];
    const namelist = getTargetFieldName("organization", this.props.fieldData);
    for (let name of namelist) {
      const tagItems = this.state[name];
      if (tagItems && tagItems.length > 0) {
        for (let t of tagItems) {
          tags.push(getFieldDataById(fieldData, t));
        }
      }
    }
    if (tags.length === 0 && (!searchStr || searchStr.length < 3)) return null;
    return (
      <div className="filter-result">
        {tags.map((tag) => (
          <Tag
            key={tag._id}
            color={"purple"}
            closable
            onClose={() => this.handleRemoveFilter(tag)}
          >
            {tag.value}
          </Tag>
        ))}
        {searchStr && searchStr.length > 2 && (
          <Tag
            key={"search-result"}
            color={"blue"}
            closable
            onClose={() => this.handleRemoveSearchStr()}
          >
            {searchStr}
          </Tag>
        )}
        <Button type="link" onClick={this.refreshOrganization}>
          clear all
        </Button>
      </div>
    );
  };

  renderFilters = () => {
    const { searchStr } = this.state;
    const { fieldData, organization } = this.props;
    const filter_sort = getFieldData(fieldData, "sort");
    const namelist = getTargetFieldName("organization", fieldData);

    return (
      <div className="filter-list">
        <div className="flex">
          <Button type="link" className="filter-icon">
            <FilterOutlined />
          </Button>
          {namelist.map((name) => (
            <Popover
              placement="bottomLeft"
              title={getTargetLabelFromSection("organization", name)}
              content={this.mkContent(name)}
              trigger="click"
              key={name}
            >
              <Button type="link">
                {getTargetLabelFromSection("organization", name)}
                <CaretDownOutlined />
              </Button>
            </Popover>
          ))}
          <Input.Search
            placeholder="Search"
            onSearch={this.onSearch}
            onChange={this.onChangeSearch}
            value={searchStr}
            style={{ width: 170 }}
            className="ml-auto"
          />
        </div>
        {this.renderSelectedFilters()}
        <div className="show-result">
          <span>Showing {organization.total} results</span>
          <span className="ml-auto">
            <span>sort by: </span>
            <Select
              style={{ width: 150 }}
              onChange={(value) => this.onChangeFilter("filter_sort", value)}
            >
              {filter_sort.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.value}
                </Option>
              ))}
            </Select>
          </span>
        </div>
      </div>
    );
  };

  render() {
    const { organization, label, fieldData } = this.props;
    const orgs = organization.organizations;
    const { loading } = this.state;
    const cols = getOneFieldData(fieldData, "org_column");
    const nCol = parseInt(cols);
    const orgIntro = getOneFieldData(fieldData, "org_intro");

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="dashboard">
            <h5>{label.titleOrganization}s</h5>
            <hr />
            {orgIntro && (
              <div
                className="sun-editor-editable mb-4"
                dangerouslySetInnerHTML={{ __html: orgIntro }}
              />
            )}
            <Row>
              <Col>{this.renderFilters()}</Col>
            </Row>
            <Skeleton active loading={loading} />
            <Skeleton active loading={loading} />
            <Skeleton active loading={loading} />
            <InfiniteScroll
              className="row"
              loadMore={this.loadMore}
              hasMore={orgs.length < organization.total - 1}
              loader={<Spinner key={orgs.length} />}
            >
              {orgs.map((item, index) => {
                let ptps = item.participants || 0;
                return (
                  <Col
                    key={index}
                    lg={12 / nCol}
                    md={nCol === 1 ? 12 : 6}
                    sm={12}
                  >
                    <Link
                      className="card-link"
                      style={{ color: "black" }}
                      to={`/organization/${item._id}`}
                    >
                      <CustomCard
                        logo={item.logo || ProjectAvatar}
                        title={item.org_name}
                        description={`${item.org_type || ""} ${
                          item.org_type && item.country ? "," : ""
                        } ${item.country || ""}`}
                        status={`${ptps + 1} members`}
                        columns={nCol}
                      />
                    </Link>
                  </Col>
                );
              })}
            </InfiniteScroll>
          </div>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    organization: state.organization,
    user: state.user,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  listOrganization,
  clearSearch,
})(OrganizationList);
