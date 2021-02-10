import { API_URL, createNotification, errorMessage } from "./index";
import Client from "./api";
import { FETCH_USER } from "./types";

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
      .delete(`${API_URL}/user/${uid}`)
      .catch((err) => createNotification("Delete Profile", errorMessage(err)));
  };
}

export function fetchUserByEmail(email) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/user/email/check`, { email });
      return res.data.user;
    } catch (err) {
      console.log(err);
    }
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
