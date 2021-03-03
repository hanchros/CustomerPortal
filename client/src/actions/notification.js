import { FETCH_NOTIFICATIONS, READ_ONE_NOTIFICATION } from "./types";
import Client from "./api";
import { API_URL, createNotification, errorMessage } from "./index";
import { message } from "antd";

//= ===============================
// Notification actions
//= ===============================
export function fetchNotifications() {
  return async (dispatch, getState) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/notification`);
      let notifications = res.data.notifications || [];
      let myId = getState().user.profile._id;
      let unread = 0;
      for (let i = 0; i < notifications.length; i++) {
        if (!notifications[i].read.includes(myId)) {
          unread++;
          notifications[i].unread = true;
        }
      }
      dispatch({
        type: FETCH_NOTIFICATIONS,
        notifications,
        unread,
      });
    } catch (err) {
      return
    }
  };
}

export function readNotification(notification) {
  return (dispatch, getState) => {
    if (!notification.unread) return;
    const client = Client(true);
    try {
      client.post(`${API_URL}/notification/read`, { _id: notification._id });
      let myId = getState().user.profile._id;
      notification.read.push(myId);
      notification.unread = false;
      dispatch({
        type: READ_ONE_NOTIFICATION,
        notification,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function sendAllNotification(data) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      if (!data.title || !data.content) return;
      let res = await client.post(`${API_URL}/notification/all`, data);
      message.success(res.data.message);
    } catch (err) {
      createNotification("Broadcast Notification", errorMessage(err));
    }
  };
}

export function sendProjectCreatorNotification(data) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      if (!data.title || !data.content) return;
      let res = await client.post(
        `${API_URL}/notification/project-creator`,
        data
      );
      message.success(res.data.message);
    } catch (err) {
      createNotification("Broadcast Notification", errorMessage(err));
    }
  };
}

export function sendOrgNotification(data) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      if (!data.title || !data.content) return;
      let res = await client.post(`${API_URL}/notification/organization`, data);
      message.success(res.data.message);
    } catch (err) {
      createNotification("Broadcast Notification", errorMessage(err));
    }
  };
}
