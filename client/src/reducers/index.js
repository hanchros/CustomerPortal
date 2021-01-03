import { combineReducers } from "redux";
import authReducer from "./auth";
import userReducer from "./user";
import organizationReducer from "./organization";
import profileReducer from "./profile";
import projectReducer from "./project";
import notificationReducer from "./notification";
import adminReducer from "./admin";
import helpdocReducer from "./helpdoc";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  organization: organizationReducer,
  profile: profileReducer,
  project: projectReducer,
  notification: notificationReducer,
  admin: adminReducer,
  helpdoc: helpdocReducer,
});

export default rootReducer;
