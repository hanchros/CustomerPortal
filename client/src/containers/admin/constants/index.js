import React from "react";
import { connect } from "react-redux";
import { Tabs } from "antd";
import ConstSection from "./section";
import ProfileConst from "./profile";
import OrgConst from "./organization";
import ProjectConst from "./project";
import ProfileForm from "./profile_form";
import DashboardConst from "./dashbaord";

const { TabPane } = Tabs;

class Constants extends React.Component {
  render() {
    return (
      <Tabs defaultActiveKey="1" type="card" className="container">
        <TabPane tab="Common" key="1">
          <div className="admin-const" tabIndex="-1">
            <h5>Common constants</h5>
            <ConstSection
              fieldName={"org_type"}
              label={`Organization Type`}
              color={"blue"}
            />
            <ConstSection
              fieldName={"user_role"}
              label={`Participant Role`}
              color={"cyan"}
            />
          </div>
        </TabPane>
        <TabPane tab={"Participant"} key="2">
          <ProfileConst />
        </TabPane>
        <TabPane tab={"Organization"} key="3">
          <OrgConst />
        </TabPane>
        <TabPane tab={"Project"} key="5">
          <ProjectConst />
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
  return {};
}

export default connect(mapStateToProps, {})(Constants);
