import {
  FETCH_PROJECT_LIST,
  FETCH_PROJECT,
  FETCH_PROJECT_PARTICIPANTS,
  FETCH_PROJECT_COMMENTS,
  FETCH_PROJECT_SEARCH_LIST,
  FETCH_PROJECT_DETAIL_LIST,
} from "../actions/types";

const INITIAL_STATE = {
  projects: [],
  total: 0,
  projectDetails: [],
  project: {},
  participants: [],
  comments: [],
  searchTxt: "",
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PROJECT_LIST:
      return {
        ...state,
        projects: [...state.projects, ...action.projects],
        total: action.total,
      };
    case FETCH_PROJECT:
      return { ...state, project: action.project };
    case FETCH_PROJECT_PARTICIPANTS:
      return { ...state, participants: action.participants };
    case FETCH_PROJECT_COMMENTS:
      return { ...state, comments: action.comments };
    case FETCH_PROJECT_SEARCH_LIST:
      return {
        ...state,
        projects: action.projects,
        searchTxt: action.searchTxt,
      };
    case FETCH_PROJECT_DETAIL_LIST:
      return { ...state, projectDetails: action.projectDetails };
    default:
      return state;
  }
}
