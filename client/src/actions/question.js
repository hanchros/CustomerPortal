import { API_URL, createNotification, errorMessage } from "./index";
import Client from "./api";
import { FETCH_QUESTIONS, FETCH_SECURITY_QUESTION } from "./types";
import { message } from "antd";
import history from "../history";

export function createQuestion(qarray) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/securityquestion`, {
        questions: qarray,
      });
      dispatch({
        type: FETCH_SECURITY_QUESTION,
        securityquestion: res.data.securityquestion,
      });
      message.success("Security questions has been set successfully");
    } catch (err) {
      createNotification("Create security question", errorMessage(err));
    }
  };
}

export function updateQuestion(qarray, qid) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.put(`${API_URL}/securityquestion`, {
        questions: qarray,
        _id: qid,
      });
      dispatch({
        type: FETCH_SECURITY_QUESTION,
        securityquestion: res.data.securityquestion,
      });
      message.success("Security questions has been updated successfully");
    } catch (err) {
      createNotification("Update security question", errorMessage(err));
    }
  };
}

export function getQuestion() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/securityquestion/user`);
      dispatch({
        type: FETCH_SECURITY_QUESTION,
        securityquestion: res.data.securityquestion,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listQuestions() {
  return async (dispatch) => {
    const client = Client();
    try {
      let res = await client.get(`${API_URL}/securityquestion/list`);
      dispatch({ type: FETCH_QUESTIONS, questions: res.data.questions });
    } catch (err) {
      console.log(err);
    }
  };
}

export function checkQuestion(data) {
  return async (dispatch) => {
    const client = Client();
    try {
      let res = await client.post(`${API_URL}/securityquestion/check`, data);
      history.push(`/reset-password/user/security${res.data.userid}`);
    } catch (err) {
      createNotification("Check security question", errorMessage(err));
    }
  };
}
