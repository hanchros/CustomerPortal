import {
  CREATE_ORGANIZATION,
  UPDATE_ORGANIZATION,
  FETCH_ORGANIZATIONLIST,
  DELETE_ORGANIZATION,
  SET_CURRENT_ORGANIZATION,
  FETCH_ORG_SEARCH_LIST,
  FETCH_SIMPLE_ORG,
  FETCH_ADMIN_ORG_LIST,
  FETCH_ORG_USER_LIST,
  SET_ORG_SETTINGS,
} from "../actions/types";
import { org_consts } from "../constants";

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
      org = action.organization;
      if (!org.profile) org.profile = {};
      const style = document.documentElement.style;
      let ost = {
        primary_color: org.profile.primary_color || org_consts.primary_color,
        secondary_color:
          org.profile.secondary_color || org_consts.secondary_color,
        background_color:
          org.profile.background_color || org_consts.background_color,
        menufont_color: org.profile.menufont_color || org_consts.menufont_color,
        font_color: org.profile.font_color || org_consts.font_color,
        link_color: org.profile.link_color || org_consts.link_color,
        title_page: org.profile.title_page || org_consts.title_page,
        title_page_description:
          org.profile.title_page_description ||
          org_consts.title_page_description,
        logo: org.logo || org_consts.logo,
        org_name: org.org_name,
      };
      style.setProperty("--primary_color", ost.primary_color);
      style.setProperty("--secondary_color", ost.secondary_color);
      style.setProperty("--background_color", ost.background_color);
      style.setProperty("--menufont_color", ost.menufont_color);
      style.setProperty("--font_color", ost.font_color);
      style.setProperty("--link_color", ost.link_color);
      return {
        ...state,
        currentOrganization: org,
        orgSettings: ost,
      };
    case SET_ORG_SETTINGS:
      const astyle = document.documentElement.style;
      const aost = {
        primary_color: action.profile.primary_color || org_consts.primary_color,
        secondary_color:
          action.profile.secondary_color || org_consts.secondary_color,
        background_color:
          action.profile.background_color || org_consts.background_color,
        menufont_color:
          action.profile.menufont_color || org_consts.menufont_color,
        font_color: action.profile.font_color || org_consts.font_color,
        link_color: action.profile.link_color || org_consts.link_color,
        title_page: action.profile.title_page || org_consts.title_page,
        title_page_description:
          action.profile.title_page_description ||
          org_consts.title_page_description,
        logo: action.logo || org_consts.logo,
        org_name: action.org_name,
      };
      astyle.setProperty("--primary_color", aost.primary_color);
      astyle.setProperty("--secondary_color", aost.secondary_color);
      astyle.setProperty("--background_color", aost.background_color);
      astyle.setProperty("--menufont_color", aost.menufont_color);
      astyle.setProperty("--font_color", aost.font_color);
      astyle.setProperty("--link_color", aost.link_color);
      return {
        ...state,
        orgSettings: aost,
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
