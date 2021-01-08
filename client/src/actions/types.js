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
  FETCH_ORG_SEARCH_LIST = "fetch_org_seaerch_list",
  FETCH_SIMPLE_ORG = "fetch_simple_org",
  SET_CURRENT_ORGANIZATION = "set_current_organization";

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
  READ_ONE_NOTIFICATION = "read_one_notification";

//= =====================
// HelpDoc Actions
//= =====================
export const FETCH_HELPDOC_LIST = "fetch_helpdoc_list",
  CREATE_HELPDOC = "create_helpdoc",
  UPDATE_HELPDOC = "update_helpdoc",
  DELETE_HELPDOC = "delete_helpdoc";

//= =====================
// InviteRequest Actions
//= =====================
export const FETCH_INVITE_REQUEST_LIST = "fetch_invite_request_list",
  RESOLVE_INVITE_REQUEST = "update_invite_request";

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
  SET_CURRENT_TEMPLATE = "set_current_template";
