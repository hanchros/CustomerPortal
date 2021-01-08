import { createNotification, API_URL, errorMessage } from "./index";
import {
  FETCH_ORGANIZATION,
  FETCH_ORGANIZATIONLIST,
  SET_CURRENT_ORGANIZATION,
  FETCH_ORG_SEARCH_LIST,
  FETCH_SIMPLE_ORG,
  FETCH_ADMIN_ORG_LIST,
} from "./types";
import Client from "./api";

export function createOrganization(values) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/organization`, values);
    } catch (err) {
      createNotification("Create Organization", errorMessage(err));
    }
  };
}

export function updateOrganization(orgData) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.put(`${API_URL}/organization`, orgData);
    } catch (err) {
      createNotification("Update Organization", errorMessage(err));
    }
  };
}

export function getOrganization(org_id) {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/organization/${org_id}`);
      dispatch({
        type: FETCH_ORGANIZATION,
        organization: res.data.organization,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listOrganization(count, filters) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(
        `${API_URL}/organization/list/${count}`,
        filters
      );
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
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.delete(`${API_URL}/organization/${org_id}`);
    } catch (err) {
      createNotification("Delete Project", errorMessage(err));
    }
  };
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
