import {
  FETCH_TIMELINE_LIST,
  CREATE_TIMELINE,
  UPDATE_TIMELINE,
  DELETE_TIMELINE,
} from "../actions/types";

const INITIAL_STATE = {
  timelines: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TIMELINE_LIST:
      return { ...state, timelines: action.timelines || [] };
    case CREATE_TIMELINE:
      return { ...state, timelines: [action.timeline, ...state.timelines] };
    case DELETE_TIMELINE:
      let tls = state.timelines;
      for (let i = tls.length - 1; i >= 0; i--) {
        if (tls[i]._id === action.id) tls.splice(i, 1);
      }
      return { ...state, timelines: tls };
    case UPDATE_TIMELINE:
      let utls = state.timelines;
      for (let i = 0; i < utls.length; i++) {
        if (utls[i]._id === action.timeline._id) utls[i] = action.timeline;
      }
      return {
        ...state,
        timelines: utls,
      };
    default:
      return state;
  }
}
