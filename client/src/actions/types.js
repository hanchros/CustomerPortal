//= =====================
// Auth Actions
//= =====================
export const AUTH_USER = "auth_user",
  UNAUTH_USER = "unauth_user",
  SET_PDF_INVITE_DATA = "set_pdf_invite_data";

//= =====================
// User Profile Actions
//= =====================
export const FETCH_USER = "fetch_user",
  FETCH_USER_LIST = "fetch_user_list",
  FETCH_USER_SEARCH_LIST = "fetch_user_search_list",
  UPDATE_USER_PROFILE = "update_user_profile";

//= =====================
// Organization Actions
//= =====================
export const FETCH_ORGANIZATION = "fetch_organization",
  FETCH_ORGANIZATIONLIST = "fetch_organization_list",
  UPDATE_ORGANIZATION = "update_organization",
  CREATE_ORGANIZATION = "create_organization",
  DELETE_ORGANIZATION = "delete_organization",
  FETCH_ORG_USER_LIST = "fetch_org_user_list",
  FETCH_ORG_PROJECT_LIST = "fetch_org_project_list",
  FETCH_ORG_SEARCH_LIST = "fetch_org_seaerch_list",
  FETCH_SIMPLE_ORG = "fetch_simple_org",
  SET_ORG_SETTINGS = "set_org_settings",
  SET_CURRENT_ORGANIZATION = "set_current_organization",
  SET_DEFAULT_COLOR = "set_default_color";

//= =====================
// Project Actions
//= =====================
export const FETCH_PROJECT_LIST = "fetch_project_list",
  FETCH_PROJECT = "fetch_project",
  FETCH_PROJECT_PARTICIPANTS = "fetch_project_participants",
  FETCH_PROJECT_ORGANIZATIONS = "fetch_project_organizations",
  FETCH_PROJECT_DETAIL_LIST = "fetch_project_detail_list",
  FETCH_PROJECT_COMMENTS = "fetch_project_comments",
  CREATE_PROJECT = "create_project",
  UPDATE_PROJECT = "update_project";

//= =====================
// Field data Actions
//= =====================
export const FETCH_FIELD_DATA = "fetch_field_data",
  CREATE_FIELD_DATA = "create_field_data",
  DELETE_FIELD_DATA = "delete_field_data",
  ADMIN_UPDATE_FIELD = "admin_set_column";

//= =====================
// Notification Actions
//= =====================
export const FETCH_NOTIFICATIONS = "fetch_notifications",
  RESOLVE_NOTIFICATION = "resolve_notification",
  READ_ONE_NOTIFICATION = "read_one_notification";

//= =====================
// Article Actions
//= =====================
export const FETCH_ARTICLE_LIST = "fetch_article_list",
  CREATE_ARTICLE = "create_article",
  UPDATE_ARTICLE = "update_article",
  DELETE_ARTICLE = "delete_article";

//= =====================
// InviteRequest Actions
//= =====================
export const FETCH_INVITE_REQUEST_LIST = "fetch_invite_request_list",
  RESOLVE_INVITE_REQUEST = "update_invite_request",
  FETCH_SCINVITE_LIST = "fetch_scinvite_list",
  RESOLVE_SCINVITE = "resolve_scinvite";

//= =====================
// Admin Actions
//= =====================
export const FETCH_ADMIN_PARTICIPANTS = "fetch_admin_participants",
  FETCH_REPORTS = "fetch_reports",
  UPDATE_ROLE = "update_role",
  FETCH_ADMIN_PARTICIPANT = "fetch_admin_participant",
  FETCH_ADMIN_ORG_LIST = "fetch_admin_org_list",
  FETCH_ADMIN_CHL_LIST = "fetch_admin_chl_list",
  FETCH_PROJECT_CREATORS = "fetch_project_creators";

//= =====================
// Template Actions
//= =====================
export const FETCH_TEMPLATE_LIST = "fetch_template_list",
  CREATE_TEMPLATE = "create_template",
  UPDATE_TEMPLATE = "update_template",
  DELETE_TEMPLATE = "delete_template",
  FETCH_GLOBAL_TEMPLATE_LIST = "fetch_global_template_list",
  CREATE_GLOBAL_TEMPLATE = "create_global_template",
  UPDATE_GLOBAL_TEMPLATE = "update_global_template",
  DELETE_GLOBAL_TEMPLATE = "delete_global_template";

//= =====================
// Mail Actions
//= =====================
export const FETCH_MAIL_LIST = "fetch_mail_list",
  FETCH_GLOBAL_MAIL_LIST = "fetch_global_mail_list";

//= =====================
// Faq Actions
//= =====================
export const FETCH_FAQ_LIST = "fetch_faq_list",
  CREATE_FAQ = "create_faq",
  DELETE_FAQ = "delete_faq",
  UPDATE_FAQ = "update_faq";

//= =====================
// Messaging Actions
//= =====================
export const FETCH_CONVERSATIONS = "fetch_conversations",
  SET_ON_MESSAGE = "set_on_message",
  SET_CHANNEL = "set_channel",
  FETCH_MESSAGES = "fetch_messages";

export const FETCH_TIMELINE_LIST = "fetch_timeline_list",
  CREATE_TIMELINE = "create_timeline",
  UPDATE_TIMELINE = "update_timeline",
  DELETE_TIMELINE = "delete_timeline";

export const FETCH_SOFT_COMPANIES = "fetch_soft_companies",
  FETCH_PROJECT_COMPANIES = "fetch_project_companies";

export const FETCH_TECHNOLOGY = "fetch_technology",
  UPDATE_TECHNOLOGY = "update_technology",
  CREATE_TECHNOLOGY = "create_technology",
  DELETE_TECHNOLOGY = "delete_technology";

export const FETCH_DIAGRAMS = "fetch_diagrams";
