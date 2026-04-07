import axiosClient from './axiosClient';

const authApi = {
  login: (data) => axiosClient.post('/auth/login', data),
  register: (data) => axiosClient.post('/auth/register', data),
  refreshToken: (data) => axiosClient.post('/auth/refresh-token', data),
  logout: () => axiosClient.post('/auth/logout'),
};

export default authApi;
