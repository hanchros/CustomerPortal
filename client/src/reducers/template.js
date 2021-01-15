import {
  FETCH_TEMPLATE_LIST,
  CREATE_TEMPLATE,
  UPDATE_TEMPLATE,
  DELETE_TEMPLATE,
  FETCH_GLOBAL_TEMPLATE_LIST,
  CREATE_GLOBAL_TEMPLATE,
  UPDATE_GLOBAL_TEMPLATE,
  DELETE_GLOBAL_TEMPLATE,
} from "../actions/types";

const INITIAL_STATE = {
  globalTemplates: [],
  orgTemplates: [],
};

export default function (state = INITIAL_STATE, action) {
  let tps = [];
  switch (action.type) {
    case FETCH_TEMPLATE_LIST:
      return {
        ...state,
        orgTemplates: action.templates,
      };
    case CREATE_TEMPLATE:
      tps = [...state.orgTemplates, action.template];
      return {
        ...state,
        orgTemplates: tps,
      };
    case UPDATE_TEMPLATE:
      tps = state.orgTemplates;
      for (let i = 0; i < tps.length; i++) {
        if (tps[i]._id === action.template._id) {
          tps[i] = action.template;
        }
      }
      return {
        ...state,
        orgTemplates: tps,
      };
    case DELETE_TEMPLATE:
      tps = state.orgTemplates;
      for (let i = tps.length - 1; i >= 0; i--) {
        if (tps[i]._id === action.id) {
          tps.splice(i, 1);
        }
      }
      return {
        ...state,
        orgTemplates: tps,
      };
    case FETCH_GLOBAL_TEMPLATE_LIST:
      return {
        ...state,
        globalTemplates: action.templates,
      };
    case CREATE_GLOBAL_TEMPLATE:
      tps = [...state.globalTemplates, action.template];
      return {
        ...state,
        globalTemplates: tps,
      };
    case UPDATE_GLOBAL_TEMPLATE:
      tps = state.globalTemplates;
      for (let i = 0; i < tps.length; i++) {
        if (tps[i]._id === action.template._id) {
          tps[i] = action.template;
        }
      }
      return {
        ...state,
        globalTemplates: tps,
      };
    case DELETE_GLOBAL_TEMPLATE:
      tps = state.globalTemplates;
      for (let i = tps.length - 1; i >= 0; i--) {
        if (tps[i]._id === action.id) {
          tps.splice(i, 1);
        }
      }
      return {
        ...state,
        globalTemplates: tps,
      };
    default:
      return state;
  }
}
