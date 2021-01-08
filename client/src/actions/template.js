import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import {
  FETCH_TEMPLATE_LIST,
  SET_CURRENT_TEMPLATE,
  CREATE_TEMPLATE,
  UPDATE_TEMPLATE,
} from "./types";

export function listTemplate() {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/templates`);
      dispatch({
        type: FETCH_TEMPLATE_LIST,
        templates: res.data.templates,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function createTemplate(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/templates`, values);
      dispatch({
        type: CREATE_TEMPLATE,
        template: res.data.template,
      });
    } catch (err) {
      createNotification("Create template", errorMessage(err));
    }
  };
}

export function updateTemplate(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.put(`${API_URL}/templates`, values);
      dispatch({
        type: UPDATE_TEMPLATE,
        template: res.data.template,
      });
    } catch (err) {
      createNotification("Update Template", errorMessage(err));
    }
  };
}

export function getTemplate(id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/templates/${id}`);
      return res.data.template;
    } catch (err) {
      console.log(err);
    }
  };
}

export function setCurrentTemplate(tp) {
  return (dispatch) => {
    dispatch({
      type: SET_CURRENT_TEMPLATE,
      template: tp,
    });
  };
}
