import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HiChevronLeft, HiChevronRight, HiChevronDown } from 'react-icons/hi2';
import movieApi from '../api/movieApi';
import cinemaApi from '../api/cinemaApi';
import showtimeApi from '../api/showtimeApi';
import MovieCard from '../components/movie/MovieCard';
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
      'CGV Royal City', 'CGV Tràng Tiền Plaza', 'CGV Times City',
      'CGV Hồ Gươm Plaza', 'CGV Vincom Metropolis', 'CGV Vincom Center',
      'CGV Aeon Mall Tân Phú'
    ]},
    { brand: 'Lotte Cinema', brandLabel: 'lotte', cinemas: [
      'Lotte Cinema Landmark 72', 'Lotte Cinema Thăng Long', 'Lotte Cinema Long Biên',
      'Lotte Cinema Ba Đình', 'Lotte Cinema Đống Đa', 'Lotte Cinema Landmark 81'
    ]},
    { brand: 'Beta Cineplex', brandLabel: 'beta', cinemas: [
      'Beta Cineplex Thanh Xuân', 'Beta Cineplex Giải Phóng', 'Beta Cineplex Mỹ Đình',
      'Beta Cineplex Đan Phượng', 'Beta Cineplex Xuân Thủy', 'Beta Cineplex Tây Sơn'
    ]},
    { brand: 'BHD Star', brandLabel: 'bhd', cinemas: [
      'BHD Star Vincom Phạm Ngọc Thạch', 'BHD Star The Garden', 'BHD Star Cầu Giấy',
      'BHD Star Vincom Đà Nẵng'
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

export default function MuaVePage() {
  const scrollRef = useRef(null);
  const [selectedRegion, setSelectedRegion] = useState('Hà Nội');
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedBrands, setExpandedBrands] = useState({});

  const toggleBrand = (brand) => setExpandedBrands((prev) => ({ ...prev, [brand]: !prev[brand] }));
  const navigate = useNavigate();
  const dates = generateDates(7);

  const { data: nowShowingData } = useQuery({
    queryKey: ['movies', 'now-showing'],
    queryFn: movieApi.getNowShowing,
  });

  const { data: cinemasData } = useQuery({
    queryKey: ['cinemas'],
    queryFn: cinemaApi.getAll,
  });

  const { data: showtimeData } = useQuery({
    queryKey: ['showtimes-cinema', selectedCinema, selectedDate],
    queryFn: () => showtimeApi.getByCinemaAndDate(selectedCinema, selectedDate),
    enabled: !!selectedCinema && typeof selectedCinema === 'number',
  });

  const nowShowing = nowShowingData?.data || [];
  const cinemas = cinemasData?.data || [];
  const showtimes = showtimeData?.data || [];
  const brandGroups = CINEMA_BRANDS[selectedRegion] || [];

  // Group showtimes by movie
  const movieGroups = {};
  showtimes.forEach((st) => {
    if (!movieGroups[st.movieId]) {
      movieGroups[st.movieId] = { title: st.movieTitle, genre: st.genre, duration: st.durationMinutes, rated: st.rated, posterUrl: st.posterUrl, trailerUrl: st.trailerUrl, showtimes: [] };
    }
    movieGroups[st.movieId].showtimes.push(st);
  });

  const scrollMovies = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  const resolvedCinemaName = typeof selectedCinema === 'number'
    ? cinemas.find((c) => c.id === selectedCinema)?.name || ''
    : '';

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Mua vé theo phim */}
      <section className="py-8 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Mua vé theo phim</h2>

          <div className="relative">
            <button
              onClick={() => scrollMovies(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700">
              <HiChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1">
              {nowShowing.length > 0 ? nowShowing.map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-[140px] sm:w-[160px]">
                  <MovieCard movie={movie} />
                </div>
              )) : (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px]">
                    <div className="aspect-[2/3] bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg" />
                    <div className="mt-2 h-3 bg-gray-100 dark:bg-gray-700 animate-pulse rounded w-3/4" />
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => scrollMovies(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700">
              <HiChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Mua vé theo rạp */}
      <section className="py-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Mua vé theo rạp</h2>

          {/* Mobile: stacked layout */}
          <div className="md:hidden space-y-4">
            {/* Region selector */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {REGIONS.map((r) => (
                <button key={r.name} onClick={() => { setSelectedRegion(r.name); setSelectedCinema(null); }}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${selectedRegion === r.name ? 'bg-gray-800 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                  {r.name}
                </button>
              ))}
            </div>

            {/* Cinema selector */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                {brandGroups.map((group) => (
                  <div key={group.brand}>
                    <button onClick={() => toggleBrand(group.brand)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full ${BRAND_COLORS[group.brandLabel] || 'bg-gray-500'} flex items-center justify-center text-white text-[8px] font-bold`}>
                          {group.brandLabel.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{group.brand}</span>
                        <span className="text-[10px] text-gray-400">({group.cinemas.length})</span>
                      </div>
                      <HiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedBrands[group.brand] ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedBrands[group.brand] && group.cinemas.map((cinemaName) => {
                      const rec = cinemas.find((c) => c.name === cinemaName);
                      const cid = rec?.id;
                      return (
                        <button key={cinemaName}
                          onClick={() => setSelectedCinema(cid || cinemaName)}
                          className={`w-full text-left px-5 py-2.5 text-sm border-b border-gray-50 dark:border-gray-700 transition-colors
                            ${selectedCinema === cid ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                          {cinemaName}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Date tabs */}
            <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
              {dates.map((d) => {
                const iso = d.toISOString().split('T')[0];
                return (
                  <button key={iso} onClick={() => setSelectedDate(iso)}
                    className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded text-sm min-w-[56px]
                      ${selectedDate === iso ? 'bg-gray-700 text-white font-semibold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    <span className="text-xs">{d.getDate()}/{d.getMonth()+1}</span>
                    <span className="text-xs capitalize">{d.toLocaleDateString('vi-VN',{weekday:'short'})}</span>
                  </button>
                );
              })}
            </div>

            {/* Showtimes */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              {!selectedCinema || typeof selectedCinema !== 'number' ? (
                <p className="text-center py-8 text-sm text-gray-400">Chọn rạp để xem lịch chiếu</p>
              ) : Object.keys(movieGroups).length === 0 ? (
                <p className="text-center py-8 text-sm text-gray-400">Chưa có suất chiếu</p>
              ) : (
                <div className="space-y-5">
                  {Object.entries(movieGroups).map(([movieId, group]) => (
                    <div key={movieId} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{group.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5 mb-2">
                        {group.rated && <span className="mr-1 bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] font-medium">{group.rated}</span>}
                        {group.duration && `${group.duration}'`}{group.genre && ` · ${group.genre}`}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.showtimes.map((st) => (
                          <button key={st.id} onClick={() => navigate(`/booking/seats/${st.id}`)}
                            className="px-3 py-2 rounded border border-gray-200 dark:border-gray-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {formatTime(st.startTime)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop: 3-column layout */}
          <div className="hidden md:flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden" style={{ minHeight: 480 }}>
            {/* Col 1: Khu vực */}
            <div className="w-[180px] flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
              <p className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Khu vực</p>
              {REGIONS.map((region) => (
                <button key={region.name}
                  onClick={() => { setSelectedRegion(region.name); setSelectedCinema(null); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors border-b border-gray-100 dark:border-gray-700
                    ${selectedRegion === region.name
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold border-l-[3px] border-l-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  <span className="truncate">{region.name}</span>
                  <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full px-1.5 py-0.5 flex-shrink-0 font-semibold">{region.count}</span>
                </button>
              ))}
            </div>

            {/* Col 2: Cinema list by brand */}
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
                    const rec = cinemas.find((c) => c.name === cinemaName);
                    const cid = rec?.id;
                    const active = selectedCinema === cid;
                    return (
                      <button key={cinemaName}
                        onClick={() => setSelectedCinema(cid || cinemaName)}
                        className={`w-full text-left px-5 py-2.5 text-sm border-b border-gray-50 dark:border-gray-700 transition-colors
                          ${active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}>
                        {cinemaName}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Col 2: Dates + Showtimes */}
            <div className="flex-1 overflow-y-auto">
              {/* Date tabs */}
              <div className="flex items-center gap-1 px-4 py-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
                {dates.map((d) => {
                  const iso = d.toISOString().split('T')[0];
                  return (
                    <button key={iso} onClick={() => setSelectedDate(iso)}
                      className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded text-sm transition-all min-w-[56px]
                        ${selectedDate === iso ? 'bg-gray-700 text-white font-semibold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                      <span className="text-xs">{d.getDate()}/{d.getMonth()+1}</span>
                      <span className="text-xs capitalize">{d.toLocaleDateString('vi-VN',{weekday:'short'})}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4">
                {!selectedCinema || typeof selectedCinema !== 'number' ? (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm">
                    <p>← Chọn rạp để xem lịch chiếu</p>
                  </div>
                ) : (
                  <>
                    {resolvedCinemaName && (
                      <div className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-800 dark:text-white">{resolvedCinemaName}</h3>
                      </div>
                    )}
                    {Object.keys(movieGroups).length === 0 ? (
                      <div className="text-center py-16 text-sm text-gray-400">Chưa có suất chiếu cho ngày này</div>
                    ) : (
                      <div className="space-y-6">
                        {Object.entries(movieGroups).map(([movieId, group]) => (
                          <div key={movieId} className="border-b border-gray-100 dark:border-gray-700 pb-5 last:border-0">
                            <div className="flex-1 mb-3">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{group.title}</h3>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {group.rated && <span className="mr-2 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">{group.rated}</span>}
                                {group.duration && `${group.duration}'`}
                                {group.genre && ` · ${group.genre}`}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2D Phụ Đề Anh</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {group.showtimes.map((st) => (
                                <button key={st.id} onClick={() => navigate(`/booking/seats/${st.id}`)}
                                  className="px-4 py-2 rounded border border-gray-200 dark:border-gray-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 transition-all text-sm font-medium text-gray-700 dark:text-gray-300">
                                  <div className="font-semibold">{formatTime(st.startTime)}</div>
                                  {st.basePrice && <div className="text-xs text-gray-400">{Math.round(st.basePrice / 1000)}K</div>}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
