import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true,
});

let refreshAuthToken = null;

export const setRefreshTokenFunction = (refreshFn) => {
  refreshAuthToken = refreshFn;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request URL:', config.url);
    console.log('Request Method:', config.method.toUpperCase());
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response URL:', response.config.url);
    console.log('Response Status:', response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Received 401, checking if refresh is needed:', originalRequest.url);
      if (isRefreshing) {
        console.log('Already refreshing, queuing request:', originalRequest.url);
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        if (!refreshAuthToken) {
          console.error('Refresh token function not set');
          throw new Error('Refresh token function not set');
        }
        console.log('Attempting to refresh token');
        const userData = await refreshAuthToken();
        if (!userData) {
          throw new Error('Token refresh returned no user data');
        }
        isRefreshing = false;
        processQueue(null);
        console.log('Token refreshed, retrying original request:', originalRequest.url);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError.message);
        isRefreshing = false;
        processQueue(refreshError);
        if (window.location.pathname !== '/login') {
          console.log('Redirecting to /login due to failed refresh');
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    console.error('Request failed:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;