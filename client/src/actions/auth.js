import axios from "axios";
import cookie from "react-cookies";
import { API_URL, createNotification, errorMessage } from "./index";
import {
  AUTH_USER,
  UNAUTH_USER,
  FETCH_USER,
  FETCH_USER_LIST,
  FETCH_USER_SEARCH_LIST,
  SET_PDF_INVITE_DATA,
} from "./types";
import history from "../history";
import Client from "./api";

//= ===============================
// Authentication actions
//= ===============================
export function loginUser({ email, password }) {
  return async (dispatch) => {
    const client = Client();
    try {
      const response = await client.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      cookie.save("token", response.data.token, { path: "/" });
      const user = response.data.user;
      cookie.save("user", user, { path: "/" });
      dispatch({ type: AUTH_USER });
      dispatch({ type: FETCH_USER, payload: user });
      history.push("/dashboard");
    } catch (err) {
      createNotification("Login Failed", errorMessage(err));
    }
  };
}

export function registerUser(values) {
  return async (dispatch) => {
    let vrf = {};
    const client = Client();
    try {
      const response = await client.post(
        `${API_URL}/auth/user-register`,
        values
      );
      let user = response.data.user;
      vrf = {
        _id: user._id,
        name: `${user.profile.first_name} ${user.profile.last_name} `,
        email: user.email,
      };
      localStorage.setItem("vrf", JSON.stringify(vrf));
      history.push("/resend");
    } catch (err) {
      createNotification("Register Failed", errorMessage(err));
    }
  };
}

export function registerInvitedUser(values) {
  return async (dispatch) => {
    const client = Client();
    try {
      const response = await client.post(
        `${API_URL}/auth/invite-register`,
        values
      );
      dispatch({ type: FETCH_USER, payload: response.data.user });
      return ;
    } catch (err) {
      createNotification("Register Failed", errorMessage(err));
    }
  };
}

export function dropRegFile(file) {
  var formData = new FormData();
  formData.append("file", file);
  return async (dispatch) => {
    try {
      let res = await axios.post(
        "https://integraapiproduction.azurewebsites.net/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch({
        type: SET_PDF_INVITE_DATA,
        pdfData: res.data.result,
      });
      return {
        data: res.data,
        success: true,
      };
    } catch (err) {
      return {
        error: err,
        success: false,
      };
    }
  };
}

export function confirmEmail({ token, mode }) {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${API_URL}/auth/verify`, { token, mode });
      const message = res.data.message;
      if (
        message &&
        (message.includes("verified successfully") ||
          message.includes("already been verified"))
      ) {
        localStorage.setItem("vrf", "");
      }
      return message;
    } catch (error) {
      createNotification("Confirm Email", errorMessage(error));
    }
  };
}

export function updateProfile({ profile }) {
  return function (dispatch) {
    const client = Client(true);
    client
      .post(`${API_URL}/user`, { profile })
      .then((response) => {
        dispatch({ type: FETCH_USER, payload: response.data.user });
      })
      .catch((error) => {
        createNotification("Update Profile", errorMessage(error));
      });
  };
}

export function logoutUser(error) {
  return function (dispatch, getState) {
    dispatch({ type: UNAUTH_USER, payload: error || "" });
    cookie.remove("token", { path: "/" });
    cookie.remove("user", { path: "/" });
    history.push(`/login`);
  };
}

export function getForgotPasswordToken(email, mode) {
  let url = `${API_URL}/auth/forgot-password`;
  if (mode === "organization") {
    url = `${API_URL}/organization/forgot-password`;
  }
  return function (dispatch) {
    axios
      .post(url, { email })
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        createNotification("Forgot Password", errorMessage(error));
      });
  };
}

export function resetPassword(token, password, conf_password, mode) {
  return function (dispatch) {
    if (password !== conf_password) {
      createNotification("Reset Password", "password doesn't match");
      return;
    }
    axios
      .post(`${API_URL}/auth/reset-password/${token}`, { password })
      .then(() => {
        history.push("/login");
      })
      .catch((error) => {
        createNotification("Reset Password", errorMessage(error));
      });
  };
}

export function resetPasswordSecurity(userid, password, conf_password) {
  return function (dispatch) {
    if (password !== conf_password) {
      createNotification("Reset Password", "password doesn't match");
      return;
    }
    axios
      .post(`${API_URL}/auth/reset-password-security`, { userid, password })
      .then(() => {
        // Redirect to login page on successful password reset
        history.push("/login");
      })
      .catch((error) => {
        createNotification("Reset Password", errorMessage(error));
      });
  };
}

export function protectedTest() {
  return async (dispatch) => {
    try {
      let response = await axios.get(`${API_URL}/protected`, {
        headers: { Authorization: cookie.load("token") },
      });
      if (response.data.user) {
        dispatch({ type: AUTH_USER });
        dispatch({ type: FETCH_USER, payload: response.data.user });
      }
    } catch (error) {
      dispatch({ type: UNAUTH_USER, payload: "" });
    }
  };
}

export function listAllParticipants(count, filter) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/user/list/${count}`, filter);
      dispatch({
        type: FETCH_USER_LIST,
        participants: res.data.participants,
        total: res.data.total,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function getUser(userId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/user/${userId}`);
      return res.data.user;
    } catch (err) {
      createNotification("GET User", errorMessage(err));
    }
  };
}

export function orgUsers(orgId) {
  return async (dispatch) => {
    try {
      let res = await axios.get(`${API_URL}/user/users/${orgId}`, {
        headers: { Authorization: cookie.load("token") },
      });
      return res.data.participants;
    } catch (err) {
      console.log(err);
    }
  };
}

export function resendVerification() {
  let vrf = localStorage.getItem("vrf");
  return (dispatch) => {
    if (!vrf) return;
    vrf = JSON.parse(vrf);
    axios.post(`${API_URL}/auth/resend`, vrf).catch((err) => {
      createNotification("Resend", errorMessage(err));
    });
  };
}

export function clearSearch() {
  return (dispatch) => {
    dispatch({ type: FETCH_USER_SEARCH_LIST, participants: [], searchTxt: "" });
  };
}
