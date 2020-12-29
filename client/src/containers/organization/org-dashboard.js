import React, { Component } from "react";
import { connect } from "react-redux";
import { Homepage, CreateChallenge } from "../../components/organization";
import {
  listChallenge,
  createChallenge,
  updateChallenge,
} from "../../actions/challenge";
import { orgUsers } from "../../actions/auth";
import { Header, Footer } from "../../components/template";
import { getOneFieldData } from "../../utils/helper";

class Organization extends Component {
  state = {
    isCreate: false,
    curChallenge: {},
    users: [],
  };

  componentDidMount = async () => {
    const { listChallenge, orgUsers } = this.props;
    const orgID = localStorage.getItem("orgID");
    const users = await orgUsers(orgID);
    this.setState({ users });
    listChallenge(orgID);
  };

  handleCreate = () => {
    this.setState({
      isCreate: true,
      curChallenge: { organization: this.props.organization.authOrg._id },
    });
  };

  handleUpdate = (chal) => {
    this.setState({
      isCreate: true,
      curChallenge: chal,
    });
  };

  hideChallengePage = () => {
    this.setState({ isCreate: false });
  };

  render() {
    const { organization, fieldData, label } = this.props;
    const { users, isCreate, curChallenge } = this.state;
    const curOrg = organization.authOrg;
    const dashIntro = getOneFieldData(fieldData, "dash_intro");

    return (
      <React.Fragment>
        <Header logo={curOrg.logo} />
        <div className="content container">
          {!isCreate ? (
            <React.Fragment>
              {dashIntro && (
                <div
                  className="sun-editor-editable mb-4"
                  dangerouslySetInnerHTML={{ __html: dashIntro }}
                />
              )}
              <Homepage
                users={users}
                onClickCreate={this.handleCreate}
                onClickUpdate={this.handleUpdate}
                name={curOrg.org_name}
              />
            </React.Fragment>
          ) : (
            <CreateChallenge
              createChallenge={this.props.createChallenge}
              updateChallenge={this.props.updateChallenge}
              hideChallengePage={this.hideChallengePage}
              curChallenge={curChallenge}
              fieldData={fieldData}
              label={label}
            />
          )}
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
    auth: state.auth,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  listChallenge,
  createChallenge,
  orgUsers,
  updateChallenge,
})(Organization);
