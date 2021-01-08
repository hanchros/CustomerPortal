import {
  FETCH_TEMPLATE_LIST,
  CREATE_TEMPLATE,
  UPDATE_TEMPLATE,
} from "../actions/types";

const INITIAL_STATE = {
  templates: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TEMPLATE_LIST:
      return {
        ...state,
        templates: action.templates,
      };
    case CREATE_TEMPLATE:
      let tps = state.templates;
      tps = [...tps, action.template];
      return {
        ...state,
        templates: tps,
      };
    case UPDATE_TEMPLATE:
      let utps = state.templates;
      for (let i = 0; i < utps.length; i++) {
        if (utps[i]._id === action.template._id) {
          utps[i] = action.template;
        }
      }
      return {
        ...state,
        templates: utps,
      };
    default:
      return state;
  }
}
