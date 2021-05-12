import {
  FETCH_PROJECT_LIST,
  FETCH_PROJECT,
  FETCH_PROJECT_PARTICIPANTS,
  FETCH_PROJECT_COMMENTS,
  FETCH_PROJECT_DETAIL_LIST,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  FETCH_PROJECT_ORGANIZATIONS,
  FETCH_DIAGRAMS,
} from "../actions/types";

const INITIAL_STATE = {
  projects: [],
  projectDetails: [],
  project: {},
  participants: [],
  organizations: [],
  comments: [],
  diagrams: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PROJECT_LIST:
      return {
        ...state,
        projects: action.projects,
      };
    case FETCH_PROJECT:
      return { ...state, project: action.project };
    case FETCH_PROJECT_PARTICIPANTS:
      return { ...state, participants: action.participants };
    case FETCH_PROJECT_ORGANIZATIONS:
      return { ...state, organizations: action.organizations };
    case FETCH_PROJECT_COMMENTS:
      return { ...state, comments: action.comments };
    case FETCH_PROJECT_DETAIL_LIST:
      return { ...state, projectDetails: action.projectDetails };
    case CREATE_PROJECT:
      let projs = [...state.projects, action.project];
      return {
        ...state,
        projects: projs,
        project: action.project,
      };
    case UPDATE_PROJECT:
      let uprojs = state.projects;
      for (let i = 0; i < uprojs.length; i++) {
        if (uprojs[i]._id === action.project._id) {
          uprojs[i] = action.project;
        }
      }
      return {
        ...state,
        projects: uprojs,
        project: action.project,
      };
    case FETCH_DIAGRAMS:
      return { ...state, diagrams: action.diagrams };
    default:
      return state;
  }
}
