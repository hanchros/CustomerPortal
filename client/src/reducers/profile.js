import {
  FETCH_FIELD_DATA,
  CREATE_FIELD_DATA,
  DELETE_FIELD_DATA,
  ADMIN_UPDATE_FIELD,
} from "../actions/types";

const INITIAL_STATE = {
  fieldData: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_FIELD_DATA:
      return { ...state, fieldData: action.fieldData };
    case CREATE_FIELD_DATA:
      return { ...state, fieldData: [...state.fieldData, action.fieldData] };
    case DELETE_FIELD_DATA:
      let fds = state.fieldData;
      for (let i = fds.length - 1; i >= 0; i--) {
        if (fds[i]._id === action.id) fds.splice(i, 1);
      }
      return { ...state, fieldData: fds };
    case ADMIN_UPDATE_FIELD:
      let cfds = state.fieldData;
      for (let i = 0; i < cfds.length; i++) {
        if (cfds[i].field === action.field.field) cfds[i] = action.field;
      }
      return {
        ...state,
        fieldData: cfds,
      };
    default:
      return state;
  }
}
