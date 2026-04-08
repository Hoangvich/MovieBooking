import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import movieApi from '../../api/movieApi';
import MovieCard from '../../components/movie/MovieCard';
import { MovieListSkeleton } from '../../components/common/LoadingSkeleton';

const TABS = [
  { key: 'now', label: 'Đang chiếu' },
  { key: 'soon', label: 'Sắp chiếu' },
  { key: 'all', label: 'Tất cả phim' },
];

export default function MovieListPage() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'now';
  const [tab, setTab] = useState(defaultTab);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState('');

  const queryFnMap = {
    now: movieApi.getNowShowing,
    soon: movieApi.getComingSoon,
    all: movieApi.getAll,
  };
  const queryFn = queryFnMap[tab] || movieApi.getNowShowing;
  const { data, isLoading } = useQuery({ queryKey: ['movies', tab], queryFn });

  const allMovies = data?.data || [];

  // Extract unique genres from all movies
  const genres = useMemo(() => {
    const genreSet = new Set();
    allMovies.forEach((m) => {
      if (m.genre) {
        m.genre.split(',').forEach((g) => genreSet.add(g.trim()));
      }
    });
    return Array.from(genreSet).sort();
  }, [allMovies]);

  // Filter movies
  let movies = allMovies;
  if (search) movies = movies.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));
  if (selectedGenre) movies = movies.filter((m) => m.genre && m.genre.includes(selectedGenre));

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Page header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-14 z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-6 py-0 overflow-x-auto scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap
                  ${tab === t.key
                    ? 'border-red-600 text-red-600 font-semibold'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
        {/* Search + Genre Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative max-w-sm flex-1">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm phim..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Genre tags */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              onClick={() => setSelectedGenre('')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${!selectedGenre
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              Tất cả
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${selectedGenre === genre
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <MovieListSkeleton />
        ) : movies.length > 0 ? (
          <>
            <p className="text-sm text-gray-400 mb-4">{movies.length} phim</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-base">Không tìm thấy phim</p>
          </div>
        )}
      </div>
    </div>
  );
}
