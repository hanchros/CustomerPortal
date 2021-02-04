import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import {
  FETCH_TEMPLATE_LIST,
  CREATE_TEMPLATE,
  UPDATE_TEMPLATE,
  DELETE_TEMPLATE,
  FETCH_GLOBAL_TEMPLATE_LIST,
  CREATE_GLOBAL_TEMPLATE,
  UPDATE_GLOBAL_TEMPLATE,
} from "./types";

export function listOrgTemplate(orgId) {
  const client = Client();
  return async (dispatch) => {
    if (!orgId) return;
    try {
      let res = await client.get(`${API_URL}/templates/list/org/${orgId}`);
      dispatch({
        type: FETCH_TEMPLATE_LIST,
        templates: res.data.templates,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listGlobalTemplate() {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/templates/list/global`);
      dispatch({
        type: FETCH_GLOBAL_TEMPLATE_LIST,
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
      let type = CREATE_TEMPLATE;
      if (!values.creator) type = CREATE_GLOBAL_TEMPLATE;
      dispatch({
        type,
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
      let type = UPDATE_TEMPLATE;
      if (!values.creator) type = UPDATE_GLOBAL_TEMPLATE;
      dispatch({
        type,
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
      let template = res.data.template;
      template.projects = res.data.projects;
      return template;
    } catch (err) {
      console.log(err);
    }
  };
}

export function deleteTemplate(id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.delete(`${API_URL}/templates/${id}`);
      dispatch({
        type: DELETE_TEMPLATE,
        id: id,
      });
    } catch (err) {
      createNotification("Delete Template", errorMessage(err));
    }
  };
}
