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
} from "../actions/types";

const INITIAL_STATE = {
  simpleOrgs: [],
  organizations: [],
  adminOrganizations: [],
  currentOrganization: {},
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
      return { ...state, currentOrganization: action.organization };
    case FETCH_ORGANIZATION:
      return { ...state, currentOrganization: action.payload.organization };
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
