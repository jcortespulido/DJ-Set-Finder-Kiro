import type { SetData } from '../types';
import { FavoriteButton } from './FavoriteButton';

interface SetCardProps {
  set: SetData;
  onClick: (setId: string) => void;
  onFavoriteToggle?: () => void;
}

export function SetCard({ set, onClick, onFavoriteToggle }: SetCardProps) {
  const handleClick = () => {
    if (set.id) {
      onClick(set.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="card-neon cursor-pointer group relative"
    >
      {/* Favorite Button */}
      {set.id && (
        <FavoriteButton
          setId={set.id}
          onToggle={onFavoriteToggle}
          className="absolute top-4 right-4 z-10"
        />
      )}
      {/* Artist Name with Theme Color */}
      <h3
        className="text-xl sm:text-2xl font-bold mb-2 text-shadow-neon pr-12"
        style={{ color: set.theme.primary }}
      >
        {set.artist}
      </h3>

      {/* Event Info */}
      <div className="space-y-1 mb-3">
        <p className="text-gray-300 font-semibold">{set.event}</p>
        {set.stage && (
          <p className="text-sm text-gray-400">
            <span className="text-gray-500">Stage:</span> {set.stage}
          </p>
        )}
        <p className="text-sm text-gray-400">
          <span className="text-gray-500">Fecha:</span> {set.date}
        </p>
        {set.location && (
          <p className="text-sm text-gray-400">
            <span className="text-gray-500">Lugar:</span> {set.location}
          </p>
        )}
      </div>

      {/* Description */}
      {set.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-3">
          {set.description}
        </p>
      )}

      {/* Metrics */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Tracks:</span>
          <span className="text-cyan-400 font-semibold">{set.totalTracks}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">⏱️</span>
          <span className="text-cyan-400 font-semibold">{set.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">BPM:</span>
          <span className="text-cyan-400 font-semibold">{set.bpmRange}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">🎵</span>
          <span className="text-cyan-400 font-semibold">{set.mainGenre}</span>
        </div>
        {set.favoriteCount > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-gray-500">❤️</span>
            <span className="text-pink-400 font-semibold">
              {set.favoriteCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
