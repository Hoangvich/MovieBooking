import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HiChevronDown } from 'react-icons/hi2';
import cinemaApi from '../api/cinemaApi';
import showtimeApi from '../api/showtimeApi';
import { formatTime } from '../utils/formatters';

const REGIONS = [
  { name: 'Hà Nội', count: 25 },
  { name: 'Tp. Hồ Chí Minh', count: 30 },
  { name: 'Đà Nẵng', count: 5 },
  { name: 'Hải Phòng', count: 4 },
  { name: 'Cần Thơ', count: 3 },
  { name: 'Bình Dương', count: 5 },
  { name: 'Đồng Nai', count: 4 },
  { name: 'Bà Rịa – Vũng Tàu', count: 3 },
  { name: 'Khánh Hòa', count: 3 },
  { name: 'Nghệ An', count: 2 },
  { name: 'Thanh Hóa', count: 2 },
  { name: 'Quảng Ninh', count: 2 },
  { name: 'Thừa Thiên Huế', count: 2 },
  { name: 'Lâm Đồng', count: 2 },
];

const CINEMA_BRANDS = {
  'Hà Nội': [
    { brand: 'CGV', brandLabel: 'cgv', cinemas: [
      'CGV Vincom Royal City', 'CGV Vincom Bà Triệu', 'CGV Aeon Mall Long Biên',
      'CGV Aeon Mall Hà Đông', 'CGV Ocean Park', 'CGV Tràng Tiền Plaza',
      'CGV Times City', 'CGV Hồ Gươm Plaza', 'CGV Vincom Metropolis'
    ]},
    { brand: 'Lotte Cinema', brandLabel: 'lotte', cinemas: [
      'Lotte Cinema Landmark 72', 'Lotte Cinema Thăng Long', 'Lotte Cinema Long Biên',
      'Lotte Cinema Ba Đình', 'Lotte Cinema Đống Đa'
    ]},
    { brand: 'Beta Cineplex', brandLabel: 'beta', cinemas: [
      'Beta Cineplex Thanh Xuân', 'Beta Cineplex Giải Phóng', 'Beta Cineplex Mỹ Đình',
      'Beta Cineplex Đan Phượng', 'Beta Cineplex Xuân Thủy', 'Beta Cineplex Tây Sơn'
    ]},
    { brand: 'BHD Star', brandLabel: 'bhd', cinemas: [
      'BHD Star Vincom Phạm Ngọc Thạch', 'BHD Star The Garden', 'BHD Star Cầu Giấy'
    ]},
    { brand: 'Cinestar', brandLabel: 'cinestar', cinemas: ['Cinestar Quốc Gia'] },
    { brand: 'Mega GS', brandLabel: 'mega', cinemas: ['Mega GS Cinemas Trung Hòa'] },
  ],
  'Tp. Hồ Chí Minh': [
    { brand: 'CGV', brandLabel: 'cgv', cinemas: ['CGV Vincom Center', 'CGV Aeon Tân Phú', 'CGV Crescent Mall', 'CGV Sư Vạn Hạnh', 'CGV Pandora City'] },
    { brand: 'Lotte Cinema', brandLabel: 'lotte', cinemas: ['Lotte Cinema Nowzone', 'Lotte Cinema Gò Vấp', 'Lotte Cinema Cộng Hòa', 'Lotte Cinema Nam Sài Gòn'] },
    { brand: 'BHD Star', brandLabel: 'bhd', cinemas: ['BHD Star Bitexco', 'BHD Star Phạm Hùng', 'BHD Star Quang Trung', 'BHD Star 3/2'] },
    { brand: 'Galaxy Cinema', brandLabel: 'galaxy', cinemas: ['Galaxy Tân Bình', 'Galaxy Kinh Dương Vương', 'Galaxy Nguyễn Du', 'Galaxy Quận 7'] },
    { brand: 'Cinestar', brandLabel: 'cinestar', cinemas: ['Cinestar Quốc Thanh', 'Cinestar Hai Bà Trưng'] },
  ],
  'Đà Nẵng': [
    { brand: 'CGV', brandLabel: 'cgv', cinemas: ['CGV Vincom Đà Nẵng', 'CGV Vĩnh Trung Plaza'] },
    { brand: 'Lotte Cinema', brandLabel: 'lotte', cinemas: ['Lotte Cinema Đà Nẵng'] },
    { brand: 'BHD Star', brandLabel: 'bhd', cinemas: ['BHD Star Vincom Đà Nẵng'] },
  ],
  'Hải Phòng': [
    { brand: 'CGV', brandLabel: 'cgv', cinemas: ['CGV Vincom Hải Phòng'] },
    { brand: 'Lotte Cinema', brandLabel: 'lotte', cinemas: ['Lotte Cinema Hải Phòng'] },
    { brand: 'Beta Cineplex', brandLabel: 'beta', cinemas: ['Beta Cineplex Hải Phòng'] },
  ],
  'Cần Thơ': [
    { brand: 'CGV', brandLabel: 'cgv', cinemas: ['CGV Vincom Cần Thơ'] },
    { brand: 'Lotte Cinema', brandLabel: 'lotte', cinemas: ['Lotte Cinema Cần Thơ'] },
  ],
  'Bình Dương': [
    { brand: 'CGV', brandLabel: 'cgv', cinemas: ['CGV Aeon Bình Dương', 'CGV Becamex'] },
    { brand: 'Lotte Cinema', brandLabel: 'lotte', cinemas: ['Lotte Cinema Bình Dương'] },
  ],
};

const BRAND_COLORS = {
  cgv: 'bg-red-700', lotte: 'bg-red-500', beta: 'bg-blue-600',
  bhd: 'bg-yellow-600', cinestar: 'bg-purple-600', mega: 'bg-green-600',
  galaxy: 'bg-indigo-600',
};

function generateDates(count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

function ShowtimeButton({ st, onClick }) {
  const isPast = false;
  const isHighPrice = st.price > 100000;
  return (
    <button
      onClick={() => onClick(st.id)}
      className={`px-3 py-2 rounded text-sm font-semibold transition-all min-w-[64px] text-center border
        ${isPast
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed'
          : isHighPrice
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-gray-800 dark:text-gray-200 hover:border-yellow-400'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700'}`}
      disabled={isPast}
    >
      <div>{formatTime(st.startTime)}</div>
      {st.price && <div className="text-xs font-normal text-gray-400">{Math.round(st.price / 1000)}K</div>}
    </button>
  );
}

export default function SchedulePage() {
  const [selectedRegion, setSelectedRegion] = useState('Hà Nội');
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedBrands, setExpandedBrands] = useState({});
  const navigate = useNavigate();

  const toggleBrand = (brand) => setExpandedBrands((prev) => ({ ...prev, [brand]: !prev[brand] }));
  const dates = generateDates(7);

  const { data: cinemasData } = useQuery({
    queryKey: ['cinemas'],
    queryFn: cinemaApi.getAll,
  });

  const { data: showtimeData } = useQuery({
    queryKey: ['showtimes-cinema', selectedCinema, selectedDate],
    queryFn: () => showtimeApi.getByCinemaAndDate(selectedCinema, selectedDate),
    enabled: !!selectedCinema && typeof selectedCinema === 'number',
  });

  const cinemas = cinemasData?.data || [];
  const showtimes = showtimeData?.data || [];
  const brandGroups = CINEMA_BRANDS[selectedRegion] || [];

  // Group showtimes by movie
  const movieGroups = {};
  showtimes.forEach((st) => {
    if (!movieGroups[st.movieId]) {
      movieGroups[st.movieId] = {
        title: st.movieTitle,
        genre: st.genre,
        duration: st.durationMinutes,
        rated: st.rated,
        posterUrl: st.posterUrl,
        trailerUrl: st.trailerUrl,
        showtimes: [],
      };
    }
    movieGroups[st.movieId].showtimes.push(st);
  });

  const resolvedCinemaName = typeof selectedCinema === 'string' ? selectedCinema : cinemas.find((c) => c.id === selectedCinema)?.name || '';

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero */}
      <div className="bg-cover bg-center relative" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Lịch chiếu</h1>
          <p className="text-gray-300 text-sm">Tìm lịch chiếu phim / rạp nhanh nhất với chỉ 1 bước!</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
        {/* Date selector row */}
        <div className="flex items-center gap-1 mb-5 border-b border-gray-100 dark:border-gray-700 pb-4 overflow-x-auto scrollbar-hide">
          {dates.map((d) => {
            const iso = d.toISOString().split('T')[0];
            const dayNum = d.getDate();
            const month = d.getMonth() + 1;
            const weekday = d.toLocaleDateString('vi-VN', { weekday: 'short' });
            const isSelected = selectedDate === iso;
            return (
              <button
                key={iso}
                onClick={() => setSelectedDate(iso)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-lg text-sm transition-all min-w-[70px] font-medium
                  ${isSelected ? 'bg-gray-800 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <span className="text-sm font-semibold">{dayNum}/{month}</span>
                <span className="text-xs capitalize mt-0.5">{weekday}</span>
              </button>
            );
          })}
        </div>

        {/* 3-column layout */}
        <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden" style={{ minHeight: 520 }}>

          {/* Col 1: Khu vực */}
          <div className="w-[180px] flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
            <p className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
              Khu vực
            </p>
            {REGIONS.map((region) => {
              const active = selectedRegion === region.name;
              return (
                <button
                  key={region.name}
                  onClick={() => { setSelectedRegion(region.name); setSelectedCinema(null); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors border-b border-gray-100 dark:border-gray-700
                    ${active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold border-l-[3px] border-l-blue-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <span className="truncate">{region.name}</span>
                  <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full px-1.5 py-0.5 flex-shrink-0 font-semibold">
                    {region.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Col 2: Cinema list */}
          <div className="w-[260px] flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            {brandGroups.map((group) => (
              <div key={group.brand}>
                <button onClick={() => toggleBrand(group.brand)}
                  className="w-full flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${BRAND_COLORS[group.brandLabel] || 'bg-gray-500'} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}>
                      {group.brandLabel.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{group.brand}</span>
                    <span className="text-xs text-gray-400">({group.cinemas.length})</span>
                  </div>
                  <HiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedBrands[group.brand] ? 'rotate-180' : ''}`} />
                </button>
                {expandedBrands[group.brand] && group.cinemas.map((cinemaName) => {
                  const cinemaRecord = cinemas.find((c) => c.name === cinemaName);
                  const cinemaId = cinemaRecord?.id;
                  const active = selectedCinema === cinemaId || selectedCinema === cinemaName;
                  return (
                    <button
                      key={cinemaName}
                      onClick={() => setSelectedCinema(cinemaId || cinemaName)}
                      className={`w-full text-left px-5 py-2.5 text-sm border-b border-gray-50 dark:border-gray-700 transition-colors
                        ${active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                      {cinemaName}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Col 3: Showtime cards */}
          <div className="flex-1 overflow-y-auto">
            {!selectedCinema ? (
              <>
                {/* Info banner */}
                <div className="m-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl text-sm text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                  <span>ℹ</span>
                  <span>Nhấn vào suất chiếu để tiến hành mua vé</span>
                </div>
                {/* Placeholder cards */}
                <div className="px-4 space-y-1">
                  <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl text-center text-sm text-gray-400 py-16">
                    ← Chọn rạp để xem lịch chiếu
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 space-y-1">
                {/* Info banner */}
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl text-sm text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                  <span>ℹ</span>
                  <span>Nhấn vào suất chiếu để tiến hành mua vé</span>
                </div>

                {/* Cinema header */}
                {resolvedCinemaName && (
                  <div className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{resolvedCinemaName}</h3>
                    <p className="text-xs text-gray-400">
                      {dates.find(d => d.toISOString().split('T')[0] === selectedDate)?.toLocaleDateString('vi-VN', {
                        weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {Object.keys(movieGroups).length === 0 ? (
                  <div className="text-center py-16 text-sm text-gray-400">
                    Chưa có suất chiếu cho ngày này
                  </div>
                ) : (
                  Object.entries(movieGroups).map(([movieId, group]) => (
                    <div key={movieId} className="py-5 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="flex gap-3 mb-3">
                        {group.posterUrl && (
                          <img src={group.posterUrl} alt={group.title}
                            className="w-16 h-24 object-cover rounded-lg flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-base">{group.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {group.rated && <span className="mr-2 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">{group.rated}</span>}
                            {group.duration && `${group.duration}'`}
                            {group.genre && ` · ${group.genre}`}
                          </p>
                          {group.trailerUrl && (
                            <a href={group.trailerUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-block mt-1 text-xs text-red-600 hover:underline font-medium">Trailer</a>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">2D Phụ Đề Anh</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.showtimes.map((st) => (
                          <ShowtimeButton key={st.id} st={st} onClick={(id) => navigate(`/booking/seats/${id}`)} />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}