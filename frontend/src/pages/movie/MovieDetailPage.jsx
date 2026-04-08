import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiClock, HiCalendar, HiPlay, HiXMark } from 'react-icons/hi2';
import movieApi from '../../api/movieApi';
import showtimeApi from '../../api/showtimeApi';
import { DetailSkeleton } from '../../components/common/LoadingSkeleton';
import { formatTime, formatShortDate } from '../../utils/formatters';
import { getPosterUrl } from '../../utils/imageUtils';

function generateDates(count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTrailer, setShowTrailer] = useState(false);
  const dates = generateDates(7);

  const { data: movieData, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieApi.getById(id),
  });

  const { data: showtimeData } = useQuery({
    queryKey: ['showtimes', id, selectedDate],
    queryFn: () => showtimeApi.getByMovieAndDate(id, selectedDate),
    enabled: !!id,
  });

  const movie = movieData?.data;
  const showtimes = showtimeData?.data || [];

  // Group by cinema
  const cinemaGroups = {};
  showtimes.forEach((st) => {
    if (!cinemaGroups[st.cinemaId]) {
      cinemaGroups[st.cinemaId] = { name: st.cinemaName, address: st.cinemaAddress, showtimes: [] };
    }
    cinemaGroups[st.cinemaId].showtimes.push(st);
  });

  if (isLoading) return <div className="max-w-5xl mx-auto px-4 py-8"><DetailSkeleton /></div>;
  if (!movie) return <div className="text-center py-20 text-gray-400">Không tìm thấy phim</div>;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Movie hero – dark background */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Poster */}
            <div className="w-40 sm:w-48 mx-auto sm:mx-0 flex-shrink-0">
              <img
                src={getPosterUrl(movie.id, movie.title)}
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{movie.title}</h1>
                {movie.rated && (
                  <span className="mt-1 flex-shrink-0 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {movie.rated}
                  </span>
                )}
              </div>
              {movie.originalTitle && (
                <p className="text-gray-400 text-sm italic">{movie.originalTitle}</p>
              )}

              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-300">
                {movie.durationMinutes && (
                  <span className="flex items-center gap-1.5"><HiClock className="w-4 h-4" /> {movie.durationMinutes} phút</span>
                )}
                {movie.releaseDate && (
                  <span className="flex items-center gap-1.5"><HiCalendar className="w-4 h-4" /> {formatShortDate(movie.releaseDate)}</span>
                )}
                {movie.genre && <span>{movie.genre}</span>}
                {movie.language && <span>{movie.language}</span>}
              </div>

              {movie.director && (
                <p className="text-sm text-gray-300"><span className="text-white font-medium">Đạo diễn:</span> {movie.director}</p>
              )}
              {movie.castMembers && (
                <p className="text-sm text-gray-300"><span className="text-white font-medium">Diễn viên:</span> {movie.castMembers}</p>
              )}

              {movie.description && (
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">{movie.description}</p>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => document.getElementById('showtimes')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
                >
                  Mua vé
                </button>
                {movie.trailerUrl && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all">
                    <HiPlay className="w-4 h-4" /> Xem Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && movie.trailerUrl && (() => {
        const m = movie.trailerUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        const vid = m ? m[1] : null;
        if (!vid) return null;
        return (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 sm:p-4" onClick={() => setShowTrailer(false)}>
            <button onClick={() => setShowTrailer(false)} className="absolute top-3 right-3 sm:top-5 sm:right-5 text-white/80 hover:text-white z-10">
              <HiXMark className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
            <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
              <iframe className="w-full h-full rounded-lg sm:rounded-xl" src={`https://www.youtube.com/embed/${vid}?autoplay=1`} title="Trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
        );
      })()}

      {/* Showtimes */}
      <div id="showtimes" className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Lịch chiếu &amp; Đặt vé</h2>

        {/* Date tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-2 mb-5">
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
                className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-lg text-sm min-w-[70px] transition-all font-medium
                  ${isSelected ? 'bg-gray-800 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                <span className="font-semibold">{dayNum}/{month}</span>
                <span className="text-xs capitalize">{weekday}</span>
              </button>
            );
          })}
        </div>

        {/* Info banner */}
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl text-sm text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
          <span>ℹ</span>
          <span>Nhấn vào suất chiếu để tiến hành mua vé</span>
        </div>

        {/* Cinema groups */}
        {Object.keys(cinemaGroups).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(cinemaGroups).map(([cinemaId, group]) => (
              <div key={cinemaId} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                  {group.address && (
                    <p className="text-xs text-red-600 hover:underline cursor-pointer mt-0.5">{group.address} – Bản đồ</p>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">2D Phụ Đề Anh</p>
                  <div className="flex flex-wrap gap-2">
                    {group.showtimes.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => navigate(`/booking/seats/${st.id}`)}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 transition-all text-sm text-gray-800 dark:text-gray-200 font-semibold min-w-[72px] text-center"
                      >
                        <div>{formatTime(st.startTime)}</div>
                        {st.basePrice && <div className="text-xs font-normal text-gray-400">{Math.round(st.basePrice / 1000)}K</div>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl">
            <p className="text-sm">Chưa có suất chiếu cho ngày {formatShortDate(selectedDate)}</p>
          </div>
        )}
      </div>
    </div>
  );
}