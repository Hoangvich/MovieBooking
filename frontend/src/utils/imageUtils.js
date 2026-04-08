/**
 * Get poster image URL for a movie.
 * Uses local poster files (/posters/{movieId}.jpg) served from public folder.
 * Falls back to placeholder if no movieId.
 */
export function getPosterUrl(movieId, title) {
  if (movieId) return `/posters/${movieId}.jpg`;
  return `https://placehold.co/300x450/1e293b/64748b?text=${encodeURIComponent(title || '?')}`;
}
