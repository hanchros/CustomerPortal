import axios from "axios";
import cookie from "react-cookies";

const client = (auth = false) => {
  const defaultOptions = {
    headers: auth
      ? {
          Authorization: cookie.load("token"),
        }
      : {},
  };

  return {
    get: (url, options = {}) =>
      axios.get(url, { ...defaultOptions, ...options }),
    post: (url, data, options = {}) =>
      axios.post(url, data, { ...defaultOptions, ...options }),
    put: (url, data, options = {}) =>
      axios.put(url, data, { ...defaultOptions, ...options }),
    delete: (url, options = {}) =>
      axios.delete(url, { ...defaultOptions, ...options }),
  };
};

export default client;
