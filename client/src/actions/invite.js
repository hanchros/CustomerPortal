import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import { message } from "antd";
import { FETCH_INVITE_REQUEST_LIST, RESOLVE_INVITE_REQUEST } from "./types";

export function listInviteRequest() {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/invite/request`);
      dispatch({
        type: FETCH_INVITE_REQUEST_LIST,
        invites: res.data.invites,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listInvitesByProject(project_id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/invite/project/${project_id}`);
      dispatch({
        type: FETCH_INVITE_REQUEST_LIST,
        invites: res.data.invites,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function getInvite(invite_id) {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/invite/one/${invite_id}`);
      return res.data.invite;
    } catch (err) {
      console.log(err);
    }
  };
}

export function createInviteRequest(values) {
  const client = Client();
  return async (dispatch) => {
    try {
      await client.post(`${API_URL}/invite/request`, values);
      message.success("New invite request has been created successfully!");
    } catch (err) {
      createNotification("Create Invite Request", errorMessage(err));
    }
  };
}

export function acceptOrgProject(inv_id) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      await client.post(`${API_URL}/projectorg/${inv_id}`);
      message.success("Thanks for your accept!");
    } catch (err) {
      createNotification("Follow Project", errorMessage(err));
    }
  };
}

export function resolveInvite(id, resolve) {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.put(
        `${API_URL}/invite/${resolve ? "resolve" : "cancel"}/${id}`
      );
      dispatch({
        type: RESOLVE_INVITE_REQUEST,
        invite: res.data.invite,
      });
      message.success(
        `Invite has been ${resolve ? "resolved" : "cancelled"} successfully!`
      );
    } catch (err) {
      createNotification("Resolve Invite", errorMessage(err));
    }
  };
}
