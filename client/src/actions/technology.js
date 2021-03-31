import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import { message } from "antd";
import {
  FETCH_TECHNOLOGY,
  CREATE_TECHNOLOGY,
  UPDATE_TECHNOLOGY,
  DELETE_TECHNOLOGY,
} from "./types";

export function listTechnology(org_id) {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/technology/${org_id}`);
      dispatch({
        type: FETCH_TECHNOLOGY,
        technologies: res.data.technologies,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listAllTechnology() {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/technology`);
      dispatch({
        type: FETCH_TECHNOLOGY,
        technologies: res.data.technologies,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function createTechnology(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/technology`, values);
      dispatch({
        type: CREATE_TECHNOLOGY,
        technology: res.data.technology,
      });
      message.success("New technology has been created successfully!");
    } catch (err) {
      createNotification("Create Technology", errorMessage(err));
    }
  };
}

export function deleteTechnology(id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.delete(`${API_URL}/technology/${id}`);
      dispatch({
        type: DELETE_TECHNOLOGY,
        id,
      });
    } catch (err) {
      createNotification("Delete Technology", errorMessage(err));
    }
  };
}

export function updateTechnology(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.put(`${API_URL}/technology`, values);
      dispatch({
        type: UPDATE_TECHNOLOGY,
        technology: res.data.technology,
      });
      message.success("Technology has been updated successfully!");
    } catch (err) {
      createNotification("Update Technology", errorMessage(err));
    }
  };
}
