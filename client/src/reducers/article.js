import {
  FETCH_ARTICLE_LIST,
  CREATE_ARTICLE,
  UPDATE_ARTICLE,
  DELETE_ARTICLE,
} from "../actions/types";

const INITIAL_STATE = {
  articles: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ARTICLE_LIST:
      return { ...state, articles: action.articles };
    case CREATE_ARTICLE:
      return { ...state, articles: [...state.articles, action.article] };
    case DELETE_ARTICLE:
      let hds = state.articles;
      for (let i = hds.length - 1; i >= 0; i--) {
        if (hds[i]._id === action.id) hds.splice(i, 1);
      }
      return { ...state, articles: hds };
    case UPDATE_ARTICLE:
      let ahds = state.articles;
      for (let i = 0; i < ahds.length; i++) {
        if (ahds[i]._id === action.article._id) ahds[i] = action.article;
      }
      return {
        ...state,
        articles: ahds,
      };
    default:
      return state;
  }
}
