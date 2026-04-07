import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HiCheckCircle, HiTicket, HiQrCode } from 'react-icons/hi2';
import bookingApi from '../../api/bookingApi';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatTime, getStatusColor, getStatusText } from '../../utils/formatters';

export default function BookingConfirmPage() {
  const { bookingId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingApi.getById(bookingId),
  });

  if (isLoading) return <Loading />;

  const booking = data?.data;
  if (!booking) return <div className="text-center py-20 text-dark-500">Không tìm thấy đặt vé</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Success header */}
      <div className="text-center mb-8">
        <HiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Đặt vé thành công!</h1>
        <p className="text-dark-500 mt-2">Mã đặt vé: <span className="font-mono font-bold text-primary-600">{booking.bookingCode}</span></p>
      </div>

      {/* Ticket card */}
      <div className="card overflow-hidden">
        {/* Top section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-200">Phim</p>
              <h2 className="text-xl font-bold">{booking.movieTitle}</h2>
            </div>
            <HiTicket className="w-10 h-10 text-primary-300" />
          </div>
        </div>

        {/* Ticket details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-dark-500">Rạp</p>
              <p className="font-medium">{booking.cinemaName}</p>
            </div>
            <div>
              <p className="text-dark-500">Phòng</p>
              <p className="font-medium">{booking.roomName}</p>
            </div>
            <div>
              <p className="text-dark-500">Ngày chiếu</p>
              <p className="font-medium">{booking.showDate}</p>
            </div>
            <div>
              <p className="text-dark-500">Giờ chiếu</p>
              <p className="font-medium">{formatTime(booking.startTime)}</p>
            </div>
            <div>
              <p className="text-dark-500">Ghế</p>
              <p className="font-medium text-primary-600">
                {booking.seats?.map((s) => `${s.rowName}${s.seatNumber}`).join(', ')}
              </p>
            </div>
            <div>
              <p className="text-dark-500">Trạng thái</p>
              <span className={`badge ${getStatusColor(booking.status)}`}>{getStatusText(booking.status)}</span>
            </div>
          </div>

          {/* QR code placeholder */}
          <div className="border-t border-dashed border-dark-200 dark:border-dark-700 pt-4">
            <div className="flex items-center justify-center">
              <div className="w-40 h-40 bg-dark-100 dark:bg-dark-800 rounded-xl flex items-center justify-center">
                <HiQrCode className="w-24 h-24 text-dark-400" />
              </div>
            </div>
            <p className="text-center text-xs text-dark-500 mt-2">Đưa mã QR này tại quầy vé</p>
          </div>

          {/* Total */}
          <div className="border-t border-dark-100 dark:border-dark-700 pt-4 flex justify-between items-center">
            <span className="font-medium">Tổng thanh toán</span>
            <span className="text-2xl font-bold text-primary-600">{formatCurrency(booking.totalAmount)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8 justify-center">
        <Link to="/my-bookings" className="btn-secondary">Vé của tôi</Link>
        <Link to="/" className="btn-primary">Về trang chủ</Link>
      </div>
    </div>
  );
}
