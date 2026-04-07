import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { HiArrowRight } from 'react-icons/hi2';
import showtimeApi from '../../api/showtimeApi';
import roomApi from '../../api/roomApi';
import SeatMap from '../../components/seat/SeatMap';
import Loading from '../../components/common/Loading';
import { setSelectedShowtime, clearBooking } from '../../store/slices/bookingSlice';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';

export default function SeatSelectionPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedSeats, totalAmount } = useSelector((s) => s.booking);

  const { data: showtimeData, isLoading: loadingShowtime } = useQuery({
    queryKey: ['showtime', showtimeId],
    queryFn: () => showtimeApi.getById(showtimeId),
  });

  const showtime = showtimeData?.data;

  const { data: seatData, isLoading: loadingSeats } = useQuery({
    queryKey: ['seats', showtime?.roomId, showtimeId],
    queryFn: () => roomApi.getSeatMap(showtime.roomId, showtimeId),
    enabled: !!showtime?.roomId,
  });

  useEffect(() => {
    dispatch(clearBooking());
  }, [dispatch]);

  useEffect(() => {
    if (showtime) dispatch(setSelectedShowtime(showtime));
  }, [showtime, dispatch]);

  if (loadingShowtime || loadingSeats) return <Loading />;
  if (!showtime) return <div className="text-center py-20">Không tìm thấy suất chiếu</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Showtime info */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-primary-600">{showtime.movieTitle}</h1>
            <p className="text-sm text-dark-500 mt-1">
              {showtime.cinemaName} - {showtime.roomName} | {formatDate(showtime.showDate)} | {formatTime(showtime.startTime)} - {formatTime(showtime.endTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Seat map */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-bold mb-6 text-center">Chọn ghế</h2>
        <SeatMap seats={seatData?.data || []} />
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 bg-white dark:bg-dark-900 border-t border-dark-100 dark:border-dark-800 p-4 -mx-4 sm:-mx-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-500">
              {selectedSeats.length > 0
                ? `Đã chọn: ${selectedSeats.map((s) => `${s.rowName}${s.seatNumber}`).join(', ')}`
                : 'Chưa chọn ghế nào'}
            </p>
            <p className="text-xl font-bold text-primary-600">{formatCurrency(totalAmount)}</p>
          </div>
          <button
            disabled={selectedSeats.length === 0}
            onClick={() => navigate('/booking/checkout')}
            className="btn-primary flex items-center gap-2"
          >
            Tiếp tục <HiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
