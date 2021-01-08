import {
  FETCH_INVITE_REQUEST_LIST,
  RESOLVE_INVITE_REQUEST,
} from "../actions/types";

const INITIAL_STATE = {
  inviteRequests: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_INVITE_REQUEST_LIST:
      return { ...state, inviteRequests: action.inviteRequests };
    case RESOLVE_INVITE_REQUEST:
      let airs = state.inviteRequests;
      for (let i = airs.length - 1; i >= 0; i--) {
        if (airs[i]._id === action.inviteRequest._id) {
          airs.splice(i, 1);
        }
      }
      return {
        ...state,
        inviteRequests: airs,
      };
    default:
      return state;
  }
}
