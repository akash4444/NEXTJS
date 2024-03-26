import axios from "axios";

// Create an Axios instance with default configurations
const axiosInstance = axios.create();

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Do nothing for successful responses
  (error) => {
    // Check if the error response status is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
