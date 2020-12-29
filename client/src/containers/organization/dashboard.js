import React, { Component } from "react";
import { connect } from "react-redux";
import { Skeleton } from "antd";
import { Homepage } from "../../components/organization";
import {
  getOrganization,
  setCurrentOrganization,
} from "../../actions/organization";
import {
  listChallenge,
  createChallenge,
  updateChallenge,
} from "../../actions/challenge";
import { orgUsers } from "../../actions/auth";
import { Header, Footer } from "../../components/template";

class Organization extends Component {
  state = {
    isCreate: false,
    curChallenge: {},
    users: [],
    loading: false,
  };

  componentDidMount = async () => {
    const {
      match,
      organization,
      getOrganization,
      listChallenge,
      setCurrentOrganization,
      orgUsers,
    } = this.props;
    const id = match.params.id;
    let curOrg;
    for (let org of organization.organizations) {
      if (org._id === id) {
        curOrg = org;
      }
    }
    this.setState({ loading: true });
    if (curOrg) {
      setCurrentOrganization(curOrg);
    } else {
      getOrganization(id);
    }
    const users = await orgUsers(id);
    listChallenge(id);
    this.setState({ loading: false, users });
  };

  onClickChallenge = (challenge) => {
    this.setState({ isCreate: true, curChallenge: challenge });
  };

  hideChallengePage = () => {
    this.setState({ isCreate: false });
  };

  render() {
    const { organization, label } = this.props;
    const { loading, users } = this.state;
    let curOrg = organization.currentOrganization;
    if (!curOrg) {
      return (
        <React.Fragment>
          <Header />
          <div className="content container">
            <h5>No {label.organization} with this id</h5>
          </div>
          <Footer />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Header logo={curOrg.logo} />
        <div className="content container">
          {!loading && (
            <Homepage
              users={users}
              onClickCreate={this.handleCreate}
              onClickChallenge={this.onClickChallenge}
              name={curOrg.org_name}
            />
          )}
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    organization: state.organization,
    challenge: state.challenge,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  getOrganization,
  setCurrentOrganization,
  listChallenge,
  createChallenge,
  updateChallenge,
  orgUsers,
})(Organization);