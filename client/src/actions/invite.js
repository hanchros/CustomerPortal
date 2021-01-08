import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import { message } from "antd";
import { FETCH_INVITE_REQUEST_LIST, RESOLVE_INVITE_REQUEST } from "./types";

export function listInviteRequest() {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/invite`);
      dispatch({
        type: FETCH_INVITE_REQUEST_LIST,
        inviteRequests: res.data.inviteRequests,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function createInviteRequest(values) {
  const client = Client();
  return async (dispatch) => {
    try {
      await client.post(`${API_URL}/invite`, values);
      message.success("New invite request has been created successfully!");
    } catch (err) {
      createNotification("Create Invite Request", errorMessage(err));
    }
  };
}

export function resolveInviteRequest(id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.put(`${API_URL}/invite/${id}`);
      dispatch({
        type: RESOLVE_INVITE_REQUEST,
        inviteRequest: res.data.inviteRequest,
      });
      message.success("Invite request has been resolved successfully!");
    } catch (err) {
      createNotification("Update Invite Request", errorMessage(err));
    }
  };
}
