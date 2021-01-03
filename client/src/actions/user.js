import { API_URL, createNotification, errorMessage } from "./index";
import Client from "./api";
import { FETCH_USER, UNAUTH_USER } from "./types";
import history from "../history";
import cookie from "react-cookies";

export function fetchUser(uid) {
  const client = Client(true);
  return function (dispatch) {
    client
      .get(`${API_URL}/user/${uid}`)
      .then((response) => {
        dispatch({
          type: FETCH_USER,
          payload: response.data.user,
        });
      })
      .catch((err) => console.log(err));
  };
}

export function updateUserProfile(data) {
  const client = Client(true);
  return function (dispatch) {
    client
      .post(`${API_URL}/user`, {
        data,
      })
      .then((response) => {
        dispatch({
          type: FETCH_USER,
          payload: response.data.user,
        });
      })
      .catch((err) => createNotification("Update Profile", errorMessage(err)));
  };
}

export function deleteUser(uid) {
  return function (dispatch) {
    const client = Client(true);
    client
      .post(`${API_URL}/user/block/${uid}`)
      .then((response) => {
        dispatch({ type: UNAUTH_USER, payload: "" });
        cookie.remove("token", { path: "/" });
        cookie.remove("user", { path: "/" });
        history.push(`/`);
      })
      .catch((err) => createNotification("Delete Profile", errorMessage(err)));
  };
}

export function allSimpleUsers() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/user/simple-user/list`);
      return res.data.participants;
    } catch (err) {
      createNotification("Get Participant List", errorMessage(err));
    }
  };
}
