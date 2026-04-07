import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiMagnifyingGlass, HiMapPin, HiPhone, HiChevronDown } from 'react-icons/hi2';
import cinemaApi from '../api/cinemaApi';
import { CITIES } from '../utils/constants';

const ALL_CITIES = ['Hà Nội', 'Tp. Hồ Chí Minh', 'Đà Nẵng', 'Đồng Nai', 'Cần Thơ', 'Bình Dương', 'Hải Phòng', 'Kiên Giang', 'Hải Dương', ...CITIES].filter((v, i, a) => a.indexOf(v) === i);

const BRAND_COLORS = { bg: 'bg-blue-600' };
function getBrandColor(name) {
  if (!name) return 'bg-gray-500';
  const n = name.toLowerCase();
  if (n.includes('beta')) return 'bg-blue-600';
  if (n.includes('cgv')) return 'bg-red-700';
  if (n.includes('lotte')) return 'bg-red-500';
  if (n.includes('bhd')) return 'bg-yellow-600';
  if (n.includes('cinestar')) return 'bg-purple-600';
  if (n.includes('aeon')) return 'bg-red-600';
  if (n.includes('galaxy')) return 'bg-indigo-600';
  if (n.includes('starlight')) return 'bg-orange-500';
  return 'bg-gray-600';
}

function getBrandInitials(name) {
  if (!name) return '??';
  const words = name.split(' ').filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function CinemaListPage() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('Hà Nội');

  const { data, isLoading } = useQuery({
    queryKey: ['cinemas', city],
    queryFn: () => city ? cinemaApi.getByCity(city) : cinemaApi.getAll(),
  });

  const cinemas = (data?.data || []).filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Picker modal style */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-5">Hệ thống rạp chiếu phim</h1>

        {/* Search + City filter row */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm rạp tại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400"
            />
          </div>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 bg-white cursor-pointer"
            >
              <option value="">Tất cả</option>
              {ALL_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Cinema list */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-2 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : cinemas.length > 0 ? (
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
            {cinemas.map((cinema) => (
              <div key={cinema.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full ${getBrandColor(cinema.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {getBrandInitials(cinema.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-gray-900">{cinema.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">bán vé</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cinema.address}</p>
                  {cinema.phoneNumber && (
                    <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <HiPhone className="w-3 h-3" /> {cinema.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 text-sm border border-gray-200 rounded-xl">
            Không tìm thấy rạp phù hợp
          </div>
        )}
      </div>
    </div>
  );
}