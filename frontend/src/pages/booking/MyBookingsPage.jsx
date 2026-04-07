import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HiTicket, HiXCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import bookingApi from '../../api/bookingApi';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatTime, getStatusColor, getStatusText } from '../../utils/formatters';

export default function MyBookingsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: bookingApi.getMyBookings,
  });

  const cancelMutation = useMutation({
    mutationFn: bookingApi.cancel,
    onSuccess: () => {
      toast.success('Hủy vé thành công');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: (err) => toast.error(err.message || 'Hủy vé thất bại'),
  });

  if (isLoading) return <Loading />;

  const bookings = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <HiTicket className="w-7 h-7 text-primary-600" /> Vé của tôi
      </h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <HiTicket className="w-16 h-16 text-dark-300 mx-auto mb-4" />
          <p className="text-dark-500 text-lg mb-4">Bạn chưa đặt vé nào</p>
          <Link to="/movies" className="btn-primary">Đặt vé ngay</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="card p-5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg truncate">{booking.movieTitle}</h3>
                    <span className={`badge text-xs ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-dark-500">
                    <span>{booking.cinemaName}</span>
                    <span>{booking.showDate}</span>
                    <span>{formatTime(booking.startTime)}</span>
                    <span>Ghế: {booking.seats?.map((s) => `${s.rowName}${s.seatNumber}`).join(', ')}</span>
                  </div>
                  <p className="text-sm font-medium mt-2">
                    Mã vé: <span className="font-mono text-primary-600">{booking.bookingCode}</span>
                    {' | '}
                    {formatCurrency(booking.totalAmount)}
                  </p>
                </div>

                <div className="flex gap-2 sm:flex-col">
                  <Link to={`/booking/confirm/${booking.id}`} className="btn-secondary text-sm !py-2 !px-4">
                    Chi tiết
                  </Link>
                  {booking.status === 'PENDING' && (
                    <button
                      onClick={() => { if (confirm('Bạn có chắc muốn hủy vé?')) cancelMutation.mutate(booking.id); }}
                      className="btn-danger text-sm !py-2 !px-4 flex items-center gap-1"
                    >
                      <HiXCircle className="w-4 h-4" /> Hủy
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
