import { useDispatch, useSelector } from 'react-redux';
import { toggleSeat } from '../../store/slices/bookingSlice';
import { formatCurrency } from '../../utils/formatters';
import { SEAT_TYPES } from '../../utils/constants';

export default function SeatMap({ seats }) {
  const dispatch = useDispatch();
  const { selectedSeats } = useSelector((s) => s.booking);

  // Group seats by row
  const rows = {};
  seats.forEach((seat) => {
    if (!rows[seat.rowName]) rows[seat.rowName] = [];
    rows[seat.rowName].push(seat);
  });

  const isSelected = (seatId) => selectedSeats.some((s) => s.id === seatId);

  return (
    <div className="space-y-6">
      {/* Screen */}
      <div className="relative">
        <div className="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-primary-500 to-transparent rounded-full" />
        <div className="w-3/4 mx-auto h-8 bg-gradient-to-b from-primary-500/20 to-transparent rounded-b-[100%]" />
        <p className="text-center text-sm font-medium text-dark-500 -mt-2">MÀN HÌNH</p>
      </div>

      {/* Seats grid */}
      <div className="flex flex-col items-center gap-2">
        {Object.entries(rows)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([rowName, rowSeats]) => (
            <div key={rowName} className="flex items-center gap-1.5">
              <span className="w-6 text-xs font-bold text-dark-500 text-center">{rowName}</span>
              <div className="flex gap-1.5">
                {rowSeats
                  .sort((a, b) => a.seatNumber - b.seatNumber)
                  .map((seat) => {
                    const selected = isSelected(seat.id);
                    const typeConfig = SEAT_TYPES[seat.seatType] || SEAT_TYPES.STANDARD;
                    let classes = 'w-8 h-8 sm:w-9 sm:h-9 rounded-t-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ';

                    if (!seat.available) {
                      classes += 'bg-dark-300 dark:bg-dark-600 text-dark-500 cursor-not-allowed opacity-50';
                    } else if (selected) {
                      classes += 'bg-green-500 text-white scale-110 shadow-lg shadow-green-500/30';
                    } else {
                      classes += `${typeConfig.color} text-white ${typeConfig.hoverColor} hover:scale-105`;
                    }

                    return (
                      <button
                        key={seat.id}
                        className={classes}
                        disabled={!seat.available}
                        onClick={() => seat.available && dispatch(toggleSeat(seat))}
                        title={`${seat.rowName}${seat.seatNumber} - ${typeConfig.label} - ${formatCurrency(seat.price)}`}
                      >
                        {seat.seatNumber}
                      </button>
                    );
                  })}
              </div>
              <span className="w-6 text-xs font-bold text-dark-500 text-center">{rowName}</span>
            </div>
          ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 text-sm">
        {Object.entries(SEAT_TYPES).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-t-md ${val.color}`} />
            <span>{val.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-md bg-green-500" />
          <span>Đang chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-md bg-dark-300 dark:bg-dark-600 opacity-50" />
          <span>Đã đặt</span>
        </div>
      </div>
    </div>
  );
}
