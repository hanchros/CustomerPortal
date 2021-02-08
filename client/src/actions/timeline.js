import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import {
  FETCH_TIMELINE_LIST,
  CREATE_TIMELINE,
  UPDATE_TIMELINE,
  DELETE_TIMELINE,
} from "./types";

export function listTimeline(projectId) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/timeline/${projectId}`);
      dispatch({
        type: FETCH_TIMELINE_LIST,
        timelines: res.data.timelines,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function createTimeline(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/timeline`, values);
      dispatch({
        type: CREATE_TIMELINE,
        timeline: res.data.timeline,
      });
    } catch (err) {
      createNotification("Create Timeline", errorMessage(err));
    }
  };
}

export function deleteTimeline(id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.delete(`${API_URL}/timeline/${id}`);
      dispatch({
        type: DELETE_TIMELINE,
        id,
      });
    } catch (err) {
      createNotification("Delete Timeline", errorMessage(err));
    }
  };
}

export function updateTimeline(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.put(`${API_URL}/timeline`, values);
      dispatch({
        type: UPDATE_TIMELINE,
        timeline: res.data.timeline,
      });
    } catch (err) {
      createNotification("Update Timeline", errorMessage(err));
    }
  };
}
