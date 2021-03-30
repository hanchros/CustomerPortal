import {
  FETCH_TECHNOLOGY,
  CREATE_TECHNOLOGY,
  UPDATE_TECHNOLOGY,
  DELETE_TECHNOLOGY,
} from "../actions/types";

const INITIAL_STATE = {
  technologies: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TECHNOLOGY:
      return { ...state, technologies: action.technologies };
    case CREATE_TECHNOLOGY:
      return {
        ...state,
        technologies: [...state.technologies, action.technology],
      };
    case DELETE_TECHNOLOGY:
      let hds = state.technologies;
      for (let i = hds.length - 1; i >= 0; i--) {
        if (hds[i]._id === action.id) hds.splice(i, 1);
      }
      return { ...state, technologies: hds };
    case UPDATE_TECHNOLOGY:
      let ahds = state.technologies;
      for (let i = 0; i < ahds.length; i++) {
        if (ahds[i]._id === action.technology._id) ahds[i] = action.technology;
      }
      return {
        ...state,
        technologies: ahds,
      };
    default:
      return state;
  }
}
