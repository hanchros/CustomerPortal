import { API_URL, createNotification, errorMessage } from "./index";
import {
  FETCH_ADMIN_PARTICIPANTS,
  FETCH_PROJECT_CREATORS,
  UPDATE_ROLE,
  FETCH_ADMIN_PARTICIPANT,
} from "./types";
import Client from "./api";
import { message } from "antd";

//= ===============================
// Admin actions
//= ===============================

export function listAdminParticipants() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/admin/participant/all`);
      dispatch({
        type: FETCH_ADMIN_PARTICIPANTS,
        participants: processParticipants(res.data.participants),
      });
    } catch (err) {
      createNotification("List Participant", errorMessage(err));
    }
  };
}

export function listAdminProjectCreators() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(
        `${API_URL}/admin/participant/project-creator`
      );
      dispatch({
        type: FETCH_PROJECT_CREATORS,
        creators: processCreators(res.data.participants),
      });
    } catch (err) {
      createNotification("List Creators", errorMessage(err));
    }
  };
}

export function updateRole(userid, role) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/admin/role/${userid}`, { role });
      dispatch({
        type: UPDATE_ROLE,
        user: res.data.user,
      });
    } catch (err) {
      createNotification("Update Role", errorMessage(err));
    }
  };
}

export function getAdminUser(userid) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/admin/user/${userid}`);
      dispatch({
        type: FETCH_ADMIN_PARTICIPANT,
        user: res.data.user,
      });
    } catch (err) {
      console.log(errorMessage(err));
    }
  };
}

export function updateParticipantProfile({ profile }) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/admin/user/${profile._id}`, {
        profile,
      });
      listAdminParticipants()(dispatch);
    } catch (err) {
      createNotification("Update Profile", errorMessage(err));
    }
  };
}

export function deleteParticipant(userid) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/admin/role/${userid}`, { role: "Block" });
      listAdminParticipants()(dispatch);
    } catch (err) {
      createNotification("Update Profile", errorMessage(err));
    }
  };
}

export function getEmailTempaltes() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      const res = await client.get(`${API_URL}/admin/email/template`);
      return res.data.templates;
    } catch (err) {
      console.log(errorMessage(err));
    }
  };
}

export function adminUnverifiedParticipants() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/user/unverified/list`);
      return processParticipants(res.data.participants);
    } catch (err) {
      console.log(err)
    }
  };
}

export function adminVerifyParticipant(userId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/user/unverified/${userId}`);
      message.success("User is verified successfully");
      return res.data.user;
    } catch (err) {
      createNotification("Verify User", errorMessage(err));
    }
  };
}

function processParticipants(participants) {
  if (!participants || participants.length === 0) return [];
  let result = [],
    k = 0;
  for (let pt of participants) {
    result.push({
      id: k,
      _id: pt._id,
      email: pt.email,
      name: `${pt.profile.first_name} ${pt.profile.last_name}`,
      photo: pt.profile.photo,
      org_name: pt.profile.org_name,
      phone: pt.profile.phone,
      country: pt.profile.country,
      verified: pt.verified,
      role: pt.role,
      usertype: pt.usertype,
    });
    k++;
  }
  return result;
}

function processCreators(participants) {
  if (!participants || participants.length === 0) return [];
  let result = [],
    k = 0;
  for (let pt of participants) {
    result.push({
      id: k,
      projectId: pt._id,
      _id: pt.participant._id,
      projectName: pt.name,
      email: pt.participant.email,
      name: `${pt.participant.profile.first_name} ${pt.participant.profile.last_name}`,
      photo: pt.participant.profile.photo,
      org_name: pt.participant.profile.org_name,
      phone: pt.participant.profile.phone,
      country: pt.participant.profile.country,
    });
    k++;
  }
  return result;
}

