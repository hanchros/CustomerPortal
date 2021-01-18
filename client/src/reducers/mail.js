import { FETCH_MAIL_LIST, FETCH_GLOBAL_MAIL_LIST } from "../actions/types";

const INITIAL_STATE = {
  globalMails: [],
  orgMails: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_MAIL_LIST:
      return {
        ...state,
        orgMails: action.mails,
      };
    case FETCH_GLOBAL_MAIL_LIST:
      return {
        ...state,
        globalMails: action.mails,
      };
    default:
      return state;
  }
}
