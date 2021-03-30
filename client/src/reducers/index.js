import { combineReducers } from "redux";
import authReducer from "./auth";
import userReducer from "./user";
import organizationReducer from "./organization";
import profileReducer from "./profile";
import projectReducer from "./project";
import notificationReducer from "./notification";
import adminReducer from "./admin";
import articleReducer from "./article";
import templateReducer from "./template";
import mailReducer from "./mail";
import faqReducer from "./faq";
import inviteReducer from "./invite";
import messageReducer from "./message";
import timelineReducer from "./timeline";
import softcompanyReducer from "./softcompany";
import technologyReducer from "./technology";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  organization: organizationReducer,
  profile: profileReducer,
  project: projectReducer,
  notification: notificationReducer,
  admin: adminReducer,
  article: articleReducer,
  template: templateReducer,
  mail: mailReducer,
  faq: faqReducer,
  invite: inviteReducer,
  message: messageReducer,
  timeline: timelineReducer,
  softcompany: softcompanyReducer,
  technology: technologyReducer,
});

export default rootReducer;
