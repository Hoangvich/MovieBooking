export const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export const formatShortDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  return timeStr.substring(0, 5);
};

export const getStatusColor = (status) => {
  const map = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    EXPIRED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    SUCCESS: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status) => {
  const map = {
    PENDING: 'Chờ thanh toán', CONFIRMED: 'Đã xác nhận', CANCELLED: 'Đã hủy',
    EXPIRED: 'Hết hạn', SUCCESS: 'Thành công', FAILED: 'Thất bại',
  };
  return map[status] || status;
};
