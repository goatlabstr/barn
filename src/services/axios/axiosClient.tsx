import axios from "axios";

const API_URL = process.env.REACT_APP_REST_API_ADDRESS;
const apiClient = axios.create({
  baseURL: API_URL, // <- ENV variable
});
apiClient.interceptors.request.use(
  (config) => {
    return {
      ...config,
      headers: {},
    };
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    //TODO remove or redirect to a custom 404 page
    if (error.response && error.response.status === 404) {
      console.log(404);
    }
    return Promise.reject(error);
  }
);

const { get, post, put, delete: destroy } = apiClient;
export { get, post, put, destroy };
