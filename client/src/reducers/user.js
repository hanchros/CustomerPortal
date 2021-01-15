import {
  FETCH_USER,
  FETCH_USER_LIST,
  FETCH_USER_SEARCH_LIST,
} from "../actions/types";

const INITIAL_STATE = {
  profile: {},
  participants: [],
  searchTxt: "",
  total: 0,
  isAdmin: false,
  isSuper: false,
  orgAdmin: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_USER:
      const profile = action.payload;
      localStorage.setItem("userId", profile._id);
      let isAdmin = profile.role.includes("Admin");
      let isSuper = profile.role === "SAdmin";
      let orgAdmin = false;
      if (profile.profile.org_role === "admin") {
        orgAdmin = true;
      }
      profile.profile.org = profile.profile.org || {};
      return { ...state, profile, isAdmin, isSuper, orgAdmin };
    case FETCH_USER_LIST:
      return {
        ...state,
        participants: [...state.participants, ...action.participants],
        total: action.total,
      };
    case FETCH_USER_SEARCH_LIST:
      return {
        ...state,
        participants: action.participants,
        searchTxt: action.searchTxt,
      };
    default:
      return state;
  }
}
