import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedRequestsQueue = [];

const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedRequestsQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    // Skip adding auth header for login/refresh requests
    if (!config.url.includes('/auth/')) {
      // You can add authorization header here if needed
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful login responses for debugging
    if (response.config.url.includes('/auth/login')) {
      console.log('Login successful:', response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Skip interceptor for login requests to prevent infinite loops
    if (originalRequest.url.includes('/auth/login')) {
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        console.log('Attempting token refresh...');
        await axiosInstance.post('/auth/refresh');
        console.log('Token refresh successful');
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;