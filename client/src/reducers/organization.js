import {
  CREATE_ORGANIZATION,
  UPDATE_ORGANIZATION,
  FETCH_ORGANIZATIONLIST,
  DELETE_ORGANIZATION,
  SET_CURRENT_ORGANIZATION,
  FETCH_ORGANIZATION,
  FETCH_ORG_SEARCH_LIST,
  FETCH_SIMPLE_ORG,
  FETCH_ADMIN_ORG_LIST,
  FETCH_ORG_USER_LIST,
} from "../actions/types";
import { org_consts } from "../constants/organization";

const INITIAL_STATE = {
  simpleOrgs: [],
  organizations: [],
  adminOrganizations: [],
  currentOrganization: {},
  orgSettings: org_consts,
  users: [],
  searchTxt: "",
  total: 0,
};

export default function (state = INITIAL_STATE, action) {
  let org;
  switch (action.type) {
    case CREATE_ORGANIZATION:
      return {
        ...state,
        organizations: [...state.organizations, action.payload.organization],
      };
    case UPDATE_ORGANIZATION:
      org = action.payload.organization;
      for (let item of state.organizations) {
        if (item._id === org._id) {
          item = org;
        }
      }
      return {
        ...state,
        organizations: state.organizations,
      };
    case FETCH_ORGANIZATIONLIST:
      return {
        ...state,
        organizations: [...state.organizations, ...action.organizations],
        total: action.total,
      };
    case DELETE_ORGANIZATION:
      org = action.payload.organization;
      for (let i = state.organizations.length - 1; i >= 0; i--) {
        if (state.organizations[i]._id === org._id) {
          state.organizations.splice(i, 1);
        }
      }
      return { ...state, organizations: state.organizations };
    case SET_CURRENT_ORGANIZATION:
    case FETCH_ORGANIZATION:
      org = action.organization;
      if (!org.profile) org.profile = {};
      return {
        ...state,
        currentOrganization: org,
        orgSettings: {
          primary_color: org.profile.primary_color || org_consts.primary_color,
          secondary_color:
            org.profile.secondary_color || org_consts.secondary_color,
          background_color:
            org.profile.background_color || org_consts.background_color,
          menufont_color:
            org.profile.menufont_color || org_consts.menufont_color,
          title_page: org.profile.title_page || org_consts.title_page,
          title_page_description:
            org.profile.title_page_description ||
            org_consts.title_page_description,
        },
      };
    case FETCH_ORG_SEARCH_LIST:
      return {
        ...state,
        organizations: action.organizations,
        searchTxt: action.searchTxt,
      };
    case FETCH_SIMPLE_ORG:
      return { ...state, simpleOrgs: action.simpleOrgs };
    case FETCH_ADMIN_ORG_LIST:
      return {
        ...state,
        adminOrganizations: action.organizations,
      };
    case FETCH_ORG_USER_LIST:
      return {
        ...state,
        users: action.users,
      };
    default:
      return state;
  }
}
