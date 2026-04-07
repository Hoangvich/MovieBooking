import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import bookingApi from '../../api/bookingApi';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatTime, getStatusColor, getStatusText } from '../../utils/formatters';

export default function AdminBookings() {
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async () => {
    if (!searchCode.trim()) return;
    try {
      const res = await bookingApi.getByCode(searchCode.trim());
      setSearchResult(res.data);
    } catch {
      setSearchResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search by booking code */}
      <div className="card p-6">
        <h2 className="font-bold mb-4">Tra cứu đặt vé</h2>
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input type="text" placeholder="Nhập mã đặt vé..." value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="input-field !pl-10" />
          </div>
          <button onClick={handleSearch} className="btn-primary">Tìm</button>
        </div>

        {searchResult && (
          <div className="mt-4 p-4 bg-dark-50 dark:bg-dark-800 rounded-xl space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">{searchResult.movieTitle}</span>
              <span className={`badge ${getStatusColor(searchResult.status)}`}>{getStatusText(searchResult.status)}</span>
            </div>
            <p>Mã vé: <span className="font-mono font-bold">{searchResult.bookingCode}</span></p>
            <p>Rạp: {searchResult.cinemaName} - {searchResult.roomName}</p>
            <p>Ngày: {searchResult.showDate} | {formatTime(searchResult.startTime)}</p>
            <p>Ghế: {searchResult.seats?.map((s) => `${s.rowName}${s.seatNumber}`).join(', ')}</p>
            <p className="font-bold text-primary-600">{formatCurrency(searchResult.totalAmount)}</p>
          </div>
        )}
      </div>

      <div className="card p-6">
        <h2 className="font-bold mb-4">Quản lý đặt vé</h2>
        <p className="text-sm text-dark-500">
          Sử dụng chức năng tìm kiếm để tra cứu và quản lý đặt vé theo mã booking code.
          Hệ thống hỗ trợ xem chi tiết vé, trạng thái thanh toán và thông tin ghế ngồi.
        </p>
      </div>
    </div>
  );
}
