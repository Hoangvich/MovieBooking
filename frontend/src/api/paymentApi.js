import axiosClient from './axiosClient';

const paymentApi = {
  createVNPay: (bookingId) => axiosClient.post(`/payment/vnpay/${bookingId}`),
  getStatus: (bookingId) => axiosClient.get(`/payment/status/${bookingId}`),
  payDirectly: (bookingId) => axiosClient.post(`/payment/direct/${bookingId}`),
};

export default paymentApi;
