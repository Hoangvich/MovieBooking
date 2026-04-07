import axiosClient from './axiosClient';

const roomApi = {
  getByCinema: (cinemaId) => axiosClient.get(`/rooms/cinema/${cinemaId}`),
  getById: (id) => axiosClient.get(`/rooms/${id}`),
  getSeatMap: (roomId, showtimeId) => axiosClient.get(`/rooms/${roomId}/seats`, { params: { showtimeId } }),
  create: (data) => axiosClient.post('/rooms', data),
  update: (id, data) => axiosClient.put(`/rooms/${id}`, data),
  delete: (id) => axiosClient.delete(`/rooms/${id}`),
};

export default roomApi;
