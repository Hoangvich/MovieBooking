import axiosClient from './axiosClient';

const movieApi = {
  getAll: () => axiosClient.get('/movies'),
  getById: (id) => axiosClient.get(`/movies/${id}`),
  getNowShowing: () => axiosClient.get('/movies/now-showing'),
  getComingSoon: () => axiosClient.get('/movies/coming-soon'),
  searchByTitle: (title) => axiosClient.get('/movies/search', { params: { title } }),
  searchByGenre: (genre) => axiosClient.get(`/movies/genre/${genre}`),
  create: (data) => axiosClient.post('/movies', data),
  update: (id, data) => axiosClient.put(`/movies/${id}`, data),
  delete: (id) => axiosClient.delete(`/movies/${id}`),
};

export default movieApi;
