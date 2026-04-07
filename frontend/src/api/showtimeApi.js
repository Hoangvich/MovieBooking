import axiosClient from './axiosClient';

const showtimeApi = {
  getAll: () => axiosClient.get('/showtimes'),
  getById: (id) => axiosClient.get(`/showtimes/${id}`),
  getByMovie: (movieId) => axiosClient.get(`/showtimes/movie/${movieId}`),
  getByMovieAndDate: (movieId, date) => axiosClient.get(`/showtimes/movie/${movieId}/date`, { params: { date } }),
  getByCinemaAndDate: (cinemaId, date) => axiosClient.get(`/showtimes/cinema/${cinemaId}/date`, { params: { date } }),
  filter: (movieId, cinemaId, date) => axiosClient.get('/showtimes/filter', { params: { movieId, cinemaId, date } }),
  create: (data) => axiosClient.post('/showtimes', data),
  update: (id, data) => axiosClient.put(`/showtimes/${id}`, data),
  delete: (id) => axiosClient.delete(`/showtimes/${id}`),
};

export default showtimeApi;
