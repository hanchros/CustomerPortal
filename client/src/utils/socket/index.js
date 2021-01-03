import io from "socket.io-client";
import { fetchNotifications } from "../../actions/notification";

let endpoint = process.env.REACT_APP_API_HOST;
endpoint = endpoint.slice(0, -3);

export const socket = io(endpoint);

export const configureSocket = (dispatch) => {
  socket.on("connected", () => {
    console.log("connected");
  });

  socket.on("close", () => {
    setTimeout(10000, function () {
      socket.connect();
    });
  });

  socket.on("NEW_NOTIFICATION", (data) => {
    dispatch(fetchNotifications());
  });

  return socket;
};
