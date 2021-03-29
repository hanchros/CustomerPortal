import {
  FETCH_INVITE_REQUEST_LIST,
  RESOLVE_INVITE_REQUEST,
  FETCH_SCINVITE_LIST,
} from "../actions/types";

const INITIAL_STATE = {
  invites: [],
  scinvites: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_INVITE_REQUEST_LIST:
      return { ...state, invites: action.invites };
    case RESOLVE_INVITE_REQUEST:
      let airs = state.invites;
      for (let i = airs.length - 1; i >= 0; i--) {
        if (airs[i]._id === action.invite._id) {
          airs.splice(i, 1);
        }
      }
      return {
        ...state,
        invites: airs,
      };
    case FETCH_SCINVITE_LIST:
      return { ...state, scinvites: action.invites };
    default:
      return state;
  }
}
