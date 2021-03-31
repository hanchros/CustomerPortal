import {
  FETCH_SOFT_COMPANIES,
  FETCH_PROJECT_COMPANIES,
} from "../actions/types";

const INITIAL_STATE = {
  softcompanies: [],
  projectcompanies: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SOFT_COMPANIES:
      return { ...state, softcompanies: action.softcompanies };
    case FETCH_PROJECT_COMPANIES:
      return { ...state, projectcompanies: action.projectcompanies };
    default:
      return state;
  }
}
