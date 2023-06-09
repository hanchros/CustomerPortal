import { API_URL, createNotification, errorMessage } from "./index";
import {
  FETCH_PROJECT_LIST,
  FETCH_PROJECT,
  FETCH_PROJECT_PARTICIPANTS,
  FETCH_PROJECT_DETAIL_LIST,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  FETCH_PROJECT_ORGANIZATIONS,
  FETCH_DIAGRAMS,
} from "./types";
import axios from "axios";
import Client from "./api";
import { message } from "antd";
import download from "js-file-download";

//= ===============================
// Project actions
//= ===============================
export function createProject(project) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/project`, project);
      dispatch({
        type: CREATE_PROJECT,
        project: res.data.project,
      });
    } catch (err) {
      createNotification("Create Project", errorMessage(err));
    }
  };
}

export function updateProject(project) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.put(`${API_URL}/project`, project);
      dispatch({
        type: UPDATE_PROJECT,
        project: res.data.project,
      });
    } catch (err) {
      createNotification("Update Project", errorMessage(err));
    }
  };
}

export function updateProjectTechs(id, technologies) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.put(`${API_URL}/project/technology`, {
        id,
        technologies,
      });
      dispatch({
        type: UPDATE_PROJECT,
        project: res.data.project,
      });
    } catch (err) {
      createNotification("Update Project Technology", errorMessage(err));
    }
  };
}

export function listProjects() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/project`);
      dispatch({
        type: FETCH_PROJECT_LIST,
        projects: res.data.projects,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function upvoteProject(id, vote) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/project/upvote/${id}`, {
        vote,
      });
      return res.data.project;
    } catch (err) {
      createNotification("Upvote Project", errorMessage(err));
    }
  };
}

export function getProject(projectId) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/project/${projectId}`);
      dispatch({ type: FETCH_PROJECT, project: res.data.project });
      return res.data.project || {};
    } catch (err) {
      console.log(err);
    }
  };
}

export function deleteProject(projid) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.delete(`${API_URL}/project/${projid}`);
      return res.data.project || {};
    } catch (err) {
      createNotification("Delete Project", errorMessage(err));
    }
  };
}

export function getParticipant(projectId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(
        `${API_URL}/projectmember/participant/${projectId}`
      );
      dispatch({
        type: FETCH_PROJECT_PARTICIPANTS,
        participants: res.data.participants,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function joinProject(projectId) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      let res = await client.post(`${API_URL}/projectmember/${projectId}`, {});
      message.success("You are following this project.");
      return res.data.projectmember;
    } catch (err) {
      createNotification("Follow Project", errorMessage(err));
    }
  };
}

export function joinOrgProject(projectId, userId, orgId) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      let res = await client.post(`${API_URL}/invite/project/${projectId}`, {
        user: userId,
        organization: orgId,
      });
      message.success("Invite has been sent successfully!");
      return res.data.projectOrg;
    } catch (err) {
      createNotification("Follow Project", errorMessage(err));
    }
  };
}

export function leaveProject(projectId) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      await client.delete(`${API_URL}/projectmember/${projectId}`);
      message.info("You are leaving this project.");
    } catch (err) {
      createNotification("Follow Project", errorMessage(err));
    }
  };
}

export function listOrgByProject(projectId) {
  return async (dispatch) => {
    const client = Client();
    try {
      let res = await client.get(`${API_URL}/projectorg/org/${projectId}`);
      dispatch({
        type: FETCH_PROJECT_ORGANIZATIONS,
        organizations: res.data.organizations,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listProjectByCreator(participantId) {
  return async (dispatch) => {
    try {
      let res = await axios.get(
        `${API_URL}/project/participant/${participantId}`
      );
      return res.data.projects;
    } catch (err) {
      console.log(err);
    }
  };
}

export function contactProjectCreator({ id, email, phone, gallery, message }) {
  return async (dispatch) => {
    const client = Client();
    try {
      await client.post(`${API_URL}/project/contact/${id}`, {
        email,
        phone,
        gallery,
        message,
      });
      createNotification(
        "Contact project",
        "Contact information submitted successfully"
      );
    } catch (err) {
      createNotification("Contact project", errorMessage(err));
    }
  };
}

export function listProjectDetails(orgId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/project/admin/list/${orgId}`);
      dispatch({
        type: FETCH_PROJECT_DETAIL_LIST,
        projectDetails: res.data.projects,
      });
    } catch (err) {
      createNotification("List Project Details", errorMessage(err));
    }
  };
}

export function archiveProject(id) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/project/admin/archive/${id}`);
      message.success("Project has been archived successfully");
    } catch (err) {
      createNotification("Project Archive", errorMessage(err));
    }
  };
}

export function unArchiveProject(id) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/project/admin/unarchive/${id}`);
      message.success("Project has been unarchived successfully");
    } catch (err) {
      createNotification("Project Archive", errorMessage(err));
    }
  };
}

export function sendInvite(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.post(`${API_URL}/invite/project`, values);
      message.success("Invitation sent successfully!");
    } catch (error) {
      createNotification("Send Invitation", errorMessage(error));
    }
  };
}

export function downloadInvite(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      const res = await client.post(`${API_URL}/invite/download`, values, {
        responseType: "blob",
      });
      download(res.data, "invite.pdf");
    } catch (error) {
      createNotification("Download Invitation", errorMessage(error));
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
        if (mail.name === "Project Invite") {
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
      content = content.replace("[project_name]", values.project_name);
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
      const res = await client.post(`${API_URL}/project/mail/template`, values);
      return res.data.mail;
    } catch (error) {
      console.log(error);
    }
  };
}

export function getBorderStyle() {
  return async (dispatch, getState) => {
    const orgSettings = getState().organization.orgSettings;
    return `1px solid ${orgSettings.primary_color}`;
  };
}

export function listDiagrams(project_id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      const res = await client.get(`${API_URL}/project/diagram/${project_id}`);
      dispatch({
        type: FETCH_DIAGRAMS,
        diagrams: res.data.diagrams,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function updateDiagrams(project_id, diagrams) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      const res = await client.post(
        `${API_URL}/project/diagram/${project_id}`,
        { diagrams }
      );
      dispatch({
        type: FETCH_DIAGRAMS,
        diagrams: res.data.diagrams,
      });
      message.success("Diagram has been saved successfully");
    } catch (err) {
      createNotification("Save Diagram", errorMessage(err));
    }
  };
}
