import { createNotification, API_URL, errorMessage } from "./index";
import {
  FETCH_ORGANIZATIONLIST,
  SET_CURRENT_ORGANIZATION,
  FETCH_ORG_SEARCH_LIST,
  FETCH_SIMPLE_ORG,
  FETCH_ADMIN_ORG_LIST,
  FETCH_ORG_USER_LIST,
  SET_ORG_SETTINGS,
} from "./types";
import Client from "./api";
import { message } from "antd";
import { protectedTest } from "./auth";

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
      dispatch(protectedTest());
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
      return res.data.organization;
    } catch (err) {
      console.log(err);
    }
  };
}

export function listOrgUsers(orgId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/organization/users/${orgId}`);
      dispatch({
        type: FETCH_ORG_USER_LIST,
        users: res.data.users,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function removeOrgUser(userId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.delete(`${API_URL}/organization/users/${userId}`);
    } catch (err) {
      console.log(err);
    }
  };
}

export function addOrgUser(userId, orgId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/organization/users/${userId}`, { orgId });
    } catch (err) {
      console.log(err);
    }
  };
}

export function changeUserOrgRole(userId, org_role) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/organization/role/${userId}`, { org_role });
    } catch (err) {
      console.log(err);
    }
  };
}

export function sendOrgMemberInvite(values) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/organization/invite/user`, values);
      message.success("Invitation has been sent successfully!");
    } catch (err) {
      console.log(err);
      createNotification("Invite Send", errorMessage(err));
    }
  };
}

export function acceptOrgMemberInvite(values) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/organization/invite/accept`, values);
      message.success("Invitation has been accepted successfully!");
    } catch (err) {
      console.log(err);
      createNotification("Invite Accept", errorMessage(err));
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

export function getInviteContent(values) {
  return (dispatch, getState) => {
    try {
      const mails = getState().mail.orgMails;
      const org = getState().organization.currentOrganization;
      const user = getState().user.profile;
      if (!mails || mails.length === 0) {
        message.error("No mail templates for the organization!");
        return "";
      }
      let content = "";
      for (let mail of mails) {
        if (mail.name === "Organization Invite") {
          content = mail.content;
        }
      }
      content = content.replace(
        "[name]",
        `${values.first_name} ${values.last_name}`
      );
      content = content.replace(
        "[sender_name]",
        `${user.profile.first_name} ${user.profile.last_name}`
      );
      content = content.replace("[sender_org]", org.org_name);
      return content;
    } catch (error) {
      console.log(error);
    }
  };
}

export function getInviteEmailTemplate(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      const res = await client.post(
        `${API_URL}/organization/mail/template`,
        values
      );
      return res.data.mail;
    } catch (error) {
      console.log(error);
    }
  };
}

export function getOrgByName(org_name) {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/organization/name/${org_name}`);
      dispatch({
        type: SET_ORG_SETTINGS,
        profile: res.data.organization ? res.data.organization.profile : {},
        logo: res.data.organization ? res.data.organization.logo : "",
        org_name: org_name,
      });
      return res.data.organization;
    } catch (err) {
      console.log(err);
    }
  };
}
