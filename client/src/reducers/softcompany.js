import { FETCH_SOFT_COMPANIES } from "../actions/types";

const INITIAL_STATE = {
  softcompanies: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SOFT_COMPANIES:
      return { ...state, softcompanies: action.softcompanies };
    default:
      return state;
  }
}
