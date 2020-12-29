import {
  CREATE_ORGANIZATION,
  UPDATE_ORGANIZATION,
  FETCH_ORGANIZATIONLIST,
  DELETE_ORGANIZATION,
  SET_CURRENT_ORGANIZATION,
  ORGANIZATION_ERROR,
  FETCH_ORGANIZATION,
  AUTH_ORGANIZATION,
  FETCH_ORG_SEARCH_LIST,
  FETCH_SIMPLE_ORG,
  FETCH_ADMIN_ORG_LIST,
} from "../actions/types";

const INITIAL_STATE = {
  simpleOrgs: [],
  organizations: [],
  adminOrganizations: [],
  currentOrganization: {},
  authOrg: {},
  error: "",
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
        currentOrganization: action.payload.organization,
      };
    case UPDATE_ORGANIZATION:
      org = action.payload.organization;
      for (let chl of state.organizations) {
        if (chl._id === org._id) {
          chl = org;
        }
      }
      return {
        ...state,
        organizations: state.organizations,
        currentOrganization: org,
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
      return { ...state, currentOrganization: action.organization };
    case ORGANIZATION_ERROR:
      return { ...state, error: action.payload };
    case FETCH_ORGANIZATION:
      return { ...state, currentOrganization: action.payload.organization };
    case AUTH_ORGANIZATION:
      localStorage.setItem("orgID", action.organization._id);
      return {
        ...state,
        authOrg: action.organization,
        currentOrganization: action.organization,
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
    default:
      return state;
  }
}
