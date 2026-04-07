import axios from 'axios';
import { store } from '../store/store';
import { setCredentials, logout } from '../store/slices/authSlice';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const user = store.getState().auth.user;
  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const user = store.getState().auth.user;

      if (user?.refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
            { refreshToken: user.refreshToken }
          );
          store.dispatch(setCredentials(data.data));
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return axiosClient(originalRequest);
        } catch {
          store.dispatch(logout());
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
