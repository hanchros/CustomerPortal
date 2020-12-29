import {
  getData,
  deleteData,
  errorHandler,
  createNotification,
  API_URL,
  errorMessage,
} from "./index";
import axios from "axios";
import {
  ORGANIZATION_ERROR,
  FETCH_ORGANIZATION,
  FETCH_ORGANIZATIONLIST,
  DELETE_ORGANIZATION,
  SET_CURRENT_ORGANIZATION,
  AUTH_ORGANIZATION,
  FETCH_ORG_SEARCH_LIST,
  FETCH_SIMPLE_ORG,
  FETCH_ADMIN_ORG_LIST,
} from "./types";
import Client from "./api";

export function updateOrganization(orgData) {
  const url = "/organization";
  return (dispatch) => {
    axios
      .put(API_URL + url, orgData)
      .then((response) => {
        dispatch({
          type: AUTH_ORGANIZATION,
          organization: response.data.organization,
        });
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, ORGANIZATION_ERROR);
      });
  };
}

export function getOrganization(org_id) {
  if (!org_id) return
  const url = `/organization/${org_id}`;
  return (dispatch) =>
    getData(FETCH_ORGANIZATION, ORGANIZATION_ERROR, false, url, dispatch);
}

export function listOrganization(count, filters) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/organization/list/${count}`, filters);
      dispatch({
        type: FETCH_ORGANIZATIONLIST,
        organizations: res.data.organizations,
        total: res.data.total,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listSimpleOrg() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/organization/list-simple/0`);
      dispatch({ type: FETCH_SIMPLE_ORG, simpleOrgs: res.data.organizations });
    } catch (err) {
      console.log(err);
    }
  };
}

export function deleteOrganization(org_id) {
  const url = `/organization/${org_id}`;
  return (dispatch) =>
    deleteData(DELETE_ORGANIZATION, ORGANIZATION_ERROR, false, url, dispatch);
}

export function setCurrentOrganization(org) {
  return (dispatch) => {
    dispatch({ type: SET_CURRENT_ORGANIZATION, organization: org });
  };
}

export function clearSearch() {
  return (dispatch) => {
    dispatch({ type: FETCH_ORG_SEARCH_LIST, organizations: [], searchTxt: "" });
  };
}

// admin
export function listOrgReport() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/organization/admin/report`);
      dispatch({
        type: FETCH_ADMIN_ORG_LIST,
        organizations: res.data.organizations,
      });
    } catch (err) {
      createNotification("List Organization", errorMessage(err));
    }
  };
}

export function listOrgUserReport() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/organization/admin/user-report`);
      dispatch({
        type: FETCH_ADMIN_ORG_LIST,
        organizations: res.data.organizations,
      });
    } catch (err) {
      createNotification("List Organization", errorMessage(err));
    }
  };
}

export function contactOrg({ id, email, phone, gallery, message }) {
  return async (dispatch) => {
    const client = Client();
    try {
      await client.post(`${API_URL}/organization/contact/${id}`, {
        email,
        phone,
        gallery,
        message,
      });
      createNotification(
        "Contact organization",
        "Contact information submitted successfully"
      );
    } catch (err) {
      createNotification("Contact organization", errorMessage(err));
    }
  };
}
