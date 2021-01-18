import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import { message } from "antd";
import { FETCH_MAIL_LIST, FETCH_GLOBAL_MAIL_LIST } from "./types";

export function listMailByOrg(orgId) {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/mails/list/org/${orgId}`);
      dispatch({
        type: FETCH_MAIL_LIST,
        mails: res.data.mails,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listMailGlobal() {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/mails/list/global`);
      dispatch({
        type: FETCH_GLOBAL_MAIL_LIST,
        mails: res.data.mails,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function createMail(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.post(`${API_URL}/mails`, values);
      message.success(
        "New global mail template has been created successfully!"
      );
      dispatch(listMailGlobal());
    } catch (err) {
      createNotification("Create Mail", errorMessage(err));
    }
  };
}

export function updateMail(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.put(`${API_URL}/mails`, values);
      message.success("Mail has been updated successfully!");
      if (values.organization) {
        dispatch(listMailByOrg(values.organization));
      } else {
        dispatch(listMailGlobal());
      }
    } catch (err) {
      createNotification("Update Mail", errorMessage(err));
    }
  };
}

export function deleteMail(id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.delete(`${API_URL}/mails/${id}`);
    } catch (err) {
      createNotification("Delete Mail", errorMessage(err));
    }
  };
}
