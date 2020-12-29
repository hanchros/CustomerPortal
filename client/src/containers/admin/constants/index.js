import React from "react";
import { connect } from "react-redux";
import { Tabs } from "antd";
import ConstSection from "./section";
import ProfileConst from "./profile";
import GalleryConst from "./gallery";
import OrgConst from "./organization";
import ChallengeConst from "./challenge";
import ProjectConst from "./project";
import ProfileForm from "./profile_form";
import DashboardConst from "./dashbaord";

const { TabPane } = Tabs;

class Constants extends React.Component {
  render() {
    const { label } = this.props;
    return (
      <Tabs defaultActiveKey="1" type="card" className="container">
        <TabPane tab="Common" key="1">
          <div className="admin-const" tabIndex="-1">
            <h5>Common constants</h5>
            <ConstSection
              fieldName={"org_type"}
              label={`${label.titleOrganization} Type`}
              color={"blue"}
            />
            <ConstSection
              fieldName={"user_role"}
              label={`${label.titleParticipant} Role`}
              color={"cyan"}
            />
          </div>
        </TabPane>
        <TabPane tab={label.titleParticipant} key="2">
          <ProfileConst />
        </TabPane>
        <TabPane tab={label.titleOrganization} key="3">
          <OrgConst />
        </TabPane>
        <TabPane tab={label.titleChallenge} key="4">
          <ChallengeConst />
        </TabPane>
        <TabPane tab={label.titleProject} key="5">
          <ProjectConst />
        </TabPane>
        <TabPane tab={label.titleGallery} key="6">
          <GalleryConst />
        </TabPane>
        <TabPane tab="Profile" key="7">
          <ProfileForm />
        </TabPane>
        <TabPane tab="Dashboard" key="8">
          <DashboardConst />
        </TabPane>
      </Tabs>
    );
  }
}

function mapStateToProps(state) {
  return { label: state.label };
}

export default connect(mapStateToProps, {})(Constants);
