import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiPlay, HiXMark } from 'react-icons/hi2';
import { getPosterUrl } from '../../utils/imageUtils';

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function MovieCard({ movie }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const poster = getPosterUrl(movie.id, movie.title);
  const videoId = getYouTubeId(movie.trailerUrl);

  return (
    <>
      <div className="group block">
        <div className="relative overflow-hidden rounded-lg shadow-sm">
          <Link to={`/movies/${movie.id}`}>
            <img
              src={poster}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-400"
            />
          </Link>

          {movie.rated && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              {movie.rated}
            </span>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end">
            {videoId && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowTrailer(true);
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-all border-2 border-white/60 z-10"
              >
                <HiPlay className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-0.5" />
              </button>
            )}

            <div className="w-full p-3">
              <Link
                to={`/movies/${movie.id}`}
                className="block bg-red-600 hover:bg-red-700 text-white text-center text-sm font-semibold py-2 rounded-md transition-colors"
              >
                Mua vé
              </Link>
            </div>
          </div>
        </div>

        <Link to={`/movies/${movie.id}`} className="block mt-2 px-0.5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
            {movie.title}
          </h3>
          {movie.releaseDate && (
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(movie.releaseDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
            </p>
          )}
        </Link>
      </div>

      {showTrailer && videoId && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setShowTrailer(false)}
        >
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 text-white/80 hover:text-white transition-colors z-10"
          >
            <HiXMark className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>
          <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe
              className="w-full h-full rounded-lg sm:rounded-xl"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={`${movie.title} - Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
