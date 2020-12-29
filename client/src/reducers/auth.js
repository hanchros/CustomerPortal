import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FORGOT_PASSWORD_REQUEST,
  RESET_PASSWORD_REQUEST,
  PROTECTED_TEST,
  GET_QRCODE,
  SET_KEY_DATA
} from "../actions/types";

const INITIAL_STATE = {
  error: "",
  message: "",
  content: "",
  authenticated: false,
  qrcode: {},
  keyData: {},
  orgTypes: [],
  loginMode: 0
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, error: "", message: "", authenticated: true, loginMode: action.loginMode || 0 };
    case UNAUTH_USER:
      return { ...state, authenticated: false, error: action.payload };
    case AUTH_ERROR:
      return { ...state, error: action.payload };
    case FORGOT_PASSWORD_REQUEST:
      return { ...state, message: action.payload.message };
    case RESET_PASSWORD_REQUEST:
      return { ...state, message: action.payload.message };
    case PROTECTED_TEST:
      return { ...state, content: action.payload.message };
    case GET_QRCODE:
      return { ...state, qrcode: action.qrcode}
    case SET_KEY_DATA:
      return { ...state, keyData: action.keyData || {} };
    default:
      return state;
  }
}
