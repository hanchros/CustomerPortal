import { AUTH_USER, UNAUTH_USER, SET_PDF_INVITE_DATA } from "../actions/types";

const INITIAL_STATE = {
  authenticated: false,
  pdfData: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, authenticated: true };
    case UNAUTH_USER:
      return { ...state, authenticated: false };
    case SET_PDF_INVITE_DATA:
      return { ...state, pdfData: action.pdfData };
    default:
      return state;
  }
}
