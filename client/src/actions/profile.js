import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import {
  FETCH_FIELD_DATA,
  CREATE_FIELD_DATA,
  DELETE_FIELD_DATA,
  ADMIN_UPDATE_FIELD
} from "./types";

export function listFieldData() {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/fields`);
      dispatch({
        type: FETCH_FIELD_DATA,
        fieldData: res.data.fieldData,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function createFieldData(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/fields`, values);
      dispatch({
        type: CREATE_FIELD_DATA,
        fieldData: res.data.fieldData,
      });
    } catch (err) {
      createNotification("Create Categories", errorMessage(err));
    }
  };
}

export function deleteFieldData(id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.delete(`${API_URL}/fields/${id}`);
      dispatch({
        type: DELETE_FIELD_DATA,
        id,
      });
    } catch (err) {
      createNotification("Delete Categories", errorMessage(err));
    }
  };
}

export function updateFieldData(fieldData) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/fields/update`, fieldData);
      dispatch({
        type: ADMIN_UPDATE_FIELD,
        field: res.data.fieldData,
      });
    } catch (err) {
      createNotification("Update Field Data", errorMessage(err));
    }
  };
}
