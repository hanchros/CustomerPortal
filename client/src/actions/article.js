import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import { message } from "antd";
import {
  FETCH_ARTICLE_LIST,
  CREATE_ARTICLE,
  UPDATE_ARTICLE,
  DELETE_ARTICLE,
} from "./types";

export function listArticle() {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/articles`);
      dispatch({
        type: FETCH_ARTICLE_LIST,
        articles: res.data.articles,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function createArticle(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/articles`, values);
      dispatch({
        type: CREATE_ARTICLE,
        article: res.data.article,
      });
      message.success("New article has been created successfully!");
    } catch (err) {
      createNotification("Create Article", errorMessage(err));
    }
  };
}

export function deleteArticle(id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.delete(`${API_URL}/articles/${id}`);
      dispatch({
        type: DELETE_ARTICLE,
        id,
      });
    } catch (err) {
      createNotification("Delete Article", errorMessage(err));
    }
  };
}

export function updateArticle(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.put(`${API_URL}/articles`, values);
      dispatch({
        type: UPDATE_ARTICLE,
        article: res.data.article,
      });
      message.success("Article has been updated successfully!");
    } catch (err) {
      createNotification("Update Article", errorMessage(err));
    }
  };
}
