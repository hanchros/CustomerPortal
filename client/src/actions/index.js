import { notification } from "antd";

export const CLIENT_ROOT_URL = process.env.REACT_APP_API_HOST;
export const API_URL = process.env.REACT_APP_API_HOST;
//= ===============================
// Utility actions
//= ===============================

export function createNotification(message, description) {
  notification.info({
    message,
    description,
    placement: "topRight",
  });
}

export function errorMessage(err) {
  if (!err.response) return err.message;
  if (err.response.data && err.response.data.error) {
    return err.response.data.error;
  }
  return err.message;
}
