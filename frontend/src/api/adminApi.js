import axiosClient from './axiosClient';

const adminApi = {
  getRevenue: (startDate, endDate) => axiosClient.get('/admin/revenue', { params: { startDate, endDate } }),
  getDailyRevenue: (date) => axiosClient.get('/admin/revenue/daily', { params: { date } }),
  getMonthlyRevenue: (year, month) => axiosClient.get('/admin/revenue/monthly', { params: { year, month } }),
  getYearlyBreakdown: (year) => axiosClient.get('/admin/revenue/yearly-breakdown', { params: { year } }),
  getWeeklyBreakdown: (endDate) => axiosClient.get('/admin/revenue/weekly-breakdown', { params: { endDate } }),
};

export default adminApi;
