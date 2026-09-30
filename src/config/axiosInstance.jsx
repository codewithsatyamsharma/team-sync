import axios from "axios";

export let axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.config?.url !== "/auth/me") {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
