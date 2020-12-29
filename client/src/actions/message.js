import {
  FETCH_CONVERSATIONS,
  FETCH_MESSAGES,
  SET_ON_MESSAGE,
  SET_CHANNEL,
} from "./types";
import Client from "./api";
import { API_URL, createNotification, errorMessage } from "./index";
import { socket } from "../utils/socket";
import { message } from "antd";

//= ===============================
// Messaging actions
//= ===============================
export function fetchConversations() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/chat`);
      dispatch({
        type: FETCH_CONVERSATIONS,
        conversations: res.data.conversations,
        unread: res.data.unread,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function fetchOneConversation(userid) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/chat/participant/${userid}`);
      dispatch({
        type: SET_CHANNEL,
        channelId: res.data.conversation._id,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function startConversation({ recipient, composedMessage }) {
  const data = { composedMessage };
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/chat/new/${recipient}`, data);
      fetchConversations()(dispatch);
    } catch (err) {
      createNotification("Start Conversation", errorMessage(err));
    }
  };
}

export function createTeamChat(name, projectId) {
  const data = { name, projectId };
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/chat/team/new`, data);
      fetchConversations()(dispatch);
    } catch (err) {
      createNotification("Start Conversation", errorMessage(err));
    }
  };
}

export function inviteMembers(channelId, participants) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/chat/invite/${channelId}`, {
        participants,
      });
      fetchConversations()(dispatch);
    } catch (err) {
      createNotification("Invite members", errorMessage(err));
    }
  };
}

export function fetchNewMessage(data) {
  return (dispatch, getState) => {
    const message = getState().message;
    if (message.onMessage && message.channelId === data.conversationId._id) {
      fetchMessages(message.channelId)(dispatch);
    } else {
      fetchConversations()(dispatch);
    }
  };
}

export function refreshMessage(data) {
  return (dispatch, getState) => {
    const message = getState().message;
    if (message.onMessage && message.channelId === data.conversationId._id) {
      fetchMessages(message.channelId)(dispatch);
    }
  };
}

export const fetchMessages = (conversationId) => {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/chat/${conversationId}`);
      dispatch({
        type: FETCH_MESSAGES,
        messages: res.data.conversation,
        conversationId,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export function sendReply(conversationId, composedMessage) {
  const data = { composedMessage };
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/chat/${conversationId}`, data);
    } catch (err) {
      createNotification("Start Conversation", errorMessage(err));
    }
  };
}

export function updateMessage(messageId, content) {
  return async (dispatch) => {
    const client = Client(true);
    const data = { _id: messageId, content };
    try {
      await client.put(`${API_URL}/chat/message`, data);
    } catch (err) {
      createNotification("Update Message", errorMessage(err));
    }
  };
}

export function deleteMessage(messageId, conversationId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.delete(`${API_URL}/chat/message/${messageId}`);
      fetchMessages(conversationId)(dispatch);
    } catch (err) {
      createNotification("Delete Message", errorMessage(err));
    }
  };
}

export const setMessageUserId = (data) => {
  return (dispatch) => {
    socket && socket.emit("SET_USERID", data);
  };
};

export const setOnMessage = (onMessage) => {
  return (dispatch) => {
    dispatch({ type: SET_ON_MESSAGE, onMessage: onMessage });
  };
};

export const setChannel = (cvId) => {
  return (dispatch) => {
    dispatch({ type: SET_CHANNEL, channelId: cvId });
  };
};

export function blockChat(userid) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/chat/block/${userid}`);
      fetchConversations()(dispatch);
      dispatch({
        type: FETCH_MESSAGES,
        messages: [],
      });
      message.success("User is blocked successfully");
    } catch (err) {
      createNotification("Start Conversation", errorMessage(err));
    }
  };
}
