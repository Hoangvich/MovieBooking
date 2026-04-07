import axiosClient from './axiosClient';

const bookingApi = {
  create: (data) => axiosClient.post('/bookings', data),
  getById: (id) => axiosClient.get(`/bookings/${id}`),
  getMyBookings: () => axiosClient.get('/bookings/me'),
  cancel: (id) => axiosClient.put(`/bookings/${id}/cancel`),
  getByCode: (code) => axiosClient.get(`/bookings/code/${code}`),
};

export default bookingApi;
