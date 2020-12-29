import {
  FETCH_USER,
  ERROR_RESPONSE,
  FETCH_USER_LIST,
  FETCH_USER_SEARCH_LIST,
} from "../actions/types";

const INITIAL_STATE = {
  profile: {},
  participants: [],
  message: "",
  searchTxt: "",
  error: "",
  total: 0,
  isAdmin: false,
  isSuper: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_USER:
      const profile = action.payload;
      localStorage.setItem("userId", profile._id);
      let isAdmin = profile.role.includes("Admin");
      let isSuper = profile.role === "SAdmin";
      return { ...state, profile, isAdmin, isSuper };
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
    case ERROR_RESPONSE:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
