import { API_URL, createNotification, errorMessage } from "./index";
import Client from "./api";
import { message } from "antd";
import download from "js-file-download";
import {
  FETCH_SCINVITE_LIST,
  FETCH_USER,
  FETCH_SOFT_COMPANIES,
  FETCH_PROJECT_COMPANIES,
} from "./types";

export function getInviteContent(values) {
  return (dispatch, getState) => {
    try {
      const mails = getState().mail.globalMails;
      const org = getState().organization.currentOrganization;
      const user = getState().user.profile;
      if (!mails || mails.length === 0) {
        message.error("No mail templates for the organization!");
        return "";
      }
      let content = "";
      for (let mail of mails) {
        if (mail.name === "Software Company Invite") {
          content = mail.content;
        }
      }
      content = content.replace("[name]", `${values.contact}`);
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

export function listSCInvites() {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/softcompany/invites`);
      dispatch({
        type: FETCH_SCINVITE_LIST,
        invites: res.data.invites,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function sendSCInvites(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/softcompany/invite`, values);
      return res.data.invite;
    } catch (err) {
      console.log(err);
    }
  };
}

export function downloadInvite(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      const res = await client.post(`${API_URL}/softcompany/download`, values, {
        responseType: "blob",
      });
      download(res.data, "invite.pdf");
    } catch (error) {
      createNotification("Download Invitation", errorMessage(error));
    }
  };
}

export function notifyInvite(inv_id) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      await client.post(`${API_URL}/softcompany/notify-invite/${inv_id}`);
      message.success("Invitation is resent successfully");
    } catch (err) {
      createNotification("Notify Invite", errorMessage(err));
    }
  };
}

export function editInvite(inv_id, email) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      await client.post(`${API_URL}/softcompany/edit-invite/${inv_id}`, {
        email,
      });
      message.success("Invitation has been updated successfully");
    } catch (err) {
      createNotification("Update Invite", errorMessage(err));
    }
  };
}

export function registerCompany(values) {
  return async (dispatch) => {
    try {
      const client = Client();
      await client.post(`${API_URL}/softcompany/register`, values);
    } catch (err) {
      createNotification("Company Register", errorMessage(err));
    }
  };
}

export function updateCompany(profile) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      const res = await client.put(`${API_URL}/softcompany/update`, profile);
      dispatch({
        type: FETCH_USER,
        payload: res.data.softcompany,
      });
      message.success("Company profile has been updated successfully");
    } catch (err) {
      createNotification("Company Update", errorMessage(err));
    }
  };
}

export function listCompanies() {
  return async (dispatch) => {
    try {
      const client = Client(true);
      const res = await client.get(`${API_URL}/softcompany`);
      dispatch({
        type: FETCH_SOFT_COMPANIES,
        softcompanies: res.data.softcompanies,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function inviteProjectCompany(values) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      await client.post(`${API_URL}/project-company`, values);
      message.success("Invitation has been sent successfully");
    } catch (err) {
      createNotification("Send Invite", errorMessage(err));
    }
  };
}

export function resolveProjectCompany(id, resolve) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      await client.put(`${API_URL}/project-company/${id}`, { resolve });
      message.success("Invitation has been resolved successfully");
    } catch (err) {
      createNotification("Resolve Invite", errorMessage(err));
    }
  };
}

export function listPCByCompany(company_id) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      const res = await client.get(
        `${API_URL}/project-company/company/${company_id}`
      );
      dispatch({
        type: FETCH_PROJECT_COMPANIES,
        projectcompanies: res.data.projectcompanies,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listPCByProject(project_id) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      const res = await client.get(
        `${API_URL}/project-company/project/${project_id}`
      );
      dispatch({
        type: FETCH_PROJECT_COMPANIES,
        projectcompanies: res.data.projectcompanies,
      });
    } catch (err) {
      console.log(err);
    }
  };
}
