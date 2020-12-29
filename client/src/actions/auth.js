import axios from "axios";
import cookie from "react-cookies";
import { API_URL, createNotification, errorMessage } from "./index";
import {
  AUTH_USER,
  UNAUTH_USER,
  RESET_PASSWORD_REQUEST,
  FETCH_USER,
  FETCH_USER_LIST,
  AUTH_ORGANIZATION,
  FORGOT_PASSWORD_REQUEST,
  FETCH_USER_SEARCH_LIST,
  FETCH_MENTOR_LIST,
} from "./types";
import history from "../history";
import Client from "./api";
import { setMessageUserId } from "./message";
import { getOneFieldData } from "../utils/helper";
import { message } from "antd";

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
      const organization = response.data.organization;
      if (user) {
        cookie.save("user", user, { path: "/" });
        dispatch({ type: AUTH_USER });
        dispatch({ type: FETCH_USER, payload: user });
        setMessageUserId({ userId: user._id })(dispatch);
        history.push("/user-dashboard");
      } else {
        cookie.save("organization", organization, { path: "/" });
        dispatch({ type: AUTH_USER, loginMode: 1 });
        dispatch({
          type: AUTH_ORGANIZATION,
          organization,
        });
        setMessageUserId({ userId: organization._id })(dispatch);
        // if (response.data.newer) {
        history.push("/org-summary");
        // } else {
        // history.push("/org-dashboard");
        // }
      }
    } catch (err) {
      createNotification("Login Failed", errorMessage(err));
    }
  };
}

export function registerUser(values) {
  return async (dispatch, getState) => {
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
      let show_ev = getOneFieldData(getState().profile.fieldData, "show_ev");
      if (show_ev) history.push("/resend");
      else history.push("/login");
    } catch (err) {
      createNotification("Register Failed", errorMessage(err));
    }
  };
}

export function registerOrg(values) {
  return async (dispatch, getState) => {
    let vrf = {};
    const client = Client();
    try {
      const response = await client.post(
        `${API_URL}/auth/org-register`,
        values
      );
      let org = response.data.organization;
      vrf = {
        _id: org._id,
        name: org.org_name,
        email: org.authorized_email,
        mode: "organization",
      };
      localStorage.setItem("vrf", JSON.stringify(vrf));
      let show_ev = getOneFieldData(getState().profile.fieldData, "show_ev");
      if (show_ev) history.push("/resend");
      else history.push("/login");
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
        "https://integraapi.azurewebsites.net/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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

export function sendInvite(email, file) {
  var formData = new FormData();
  formData.append("file", file);
  formData.append("email", email);
  return async (dispatch) => {
    try {
      await axios.post(`${API_URL}/auth/send-invite`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Invitation sent successfully!");
    } catch (error) {
      createNotification("Send Invitation", errorMessage(error));
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
      .then((response) => {
        dispatch({
          type: FORGOT_PASSWORD_REQUEST,
          payload: response.data.message,
        });
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
      .then((response) => {
        dispatch({
          type: RESET_PASSWORD_REQUEST,
          payload: response.data.message,
        });
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
      .then((response) => {
        dispatch({
          type: RESET_PASSWORD_REQUEST,
          payload: response.data.message,
        });
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
        setMessageUserId({ userId: response.data.user._id })(dispatch);
      } else if (response.data.organization) {
        dispatch({ type: AUTH_USER, loginMode: 1 });
        dispatch({
          type: AUTH_ORGANIZATION,
          organization: response.data.organization,
        });
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

export function listAllMentors() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/user/mentor/list`);
      dispatch({
        type: FETCH_MENTOR_LIST,
        participants: res.data.participants,
        total: res.data.total,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function searchMentors(text) {
  return async (dispatch) => {
    if (text.length < 3) {
      createNotification(
        "Search Mentor",
        "Search text should be at least 3 in length"
      );
      return;
    }
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/search/mentor/${text}`);
      dispatch({
        type: FETCH_MENTOR_LIST,
        participants: res.data.participants,
        searchTxt: text,
      });
    } catch (err) {
      createNotification("Search Mentor", errorMessage(err));
    }
  };
}

export function clearMentorSearch() {
  return (dispatch) => {
    dispatch({ type: FETCH_MENTOR_LIST, participants: [], searchTxt: "" });
  };
}

export function clearSearch() {
  return (dispatch) => {
    dispatch({ type: FETCH_USER_SEARCH_LIST, participants: [], searchTxt: "" });
  };
}
