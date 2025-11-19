import type { SetData, Track, EnergyLevel } from '../types';
import { YoutubeIcon, SpotifyIcon, SoundCloudIcon } from './icons';
import { FavoriteButton } from './FavoriteButton';

interface TracklistDetailProps {
  set: SetData;
  onBack: () => void;
  onFavoriteToggle?: () => void;
}

// Mapeo de energía a colores
const energyColors: Record<EnergyLevel, string> = {
  Intro: '#4df9ff', // blue
  Groove: '#ffff00', // yellow
  Peak: '#ff4747', // red
  Buildup: '#ff8c00', // orange
  Anthem: '#d15fff', // violet
  Cierre: '#39ff14', // green
};

export function TracklistDetail({ set, onBack, onFavoriteToggle }: TracklistDetailProps) {
  // Función para generar URL de búsqueda de Spotify
  const getSpotifySearchUrl = (track: Track) => {
    const query = encodeURIComponent(`${track.artist} ${track.title}`);
    return `https://www.google.com/search?q=spotify+${query}`;
  };

  // Función para generar URL de búsqueda de SoundCloud
  const getSoundCloudSearchUrl = (track: Track) => {
    const query = encodeURIComponent(`${track.artist} ${track.title}`);
    return `https://www.google.com/search?q=soundcloud+${query}`;
  };

  // Función para generar URL de YouTube
  const getYoutubeUrl = () => {
    if (set.youtubeUrl) {
      return set.youtubeUrl;
    }
    const query = encodeURIComponent(`${set.artist} ${set.event}`);
    return `https://www.youtube.com/results?search_query=${query}`;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span className="font-semibold">Volver</span>
      </button>

      {/* Header Section */}
      <div
        className="bg-[#1a1a2e] rounded-lg p-4 sm:p-6 border relative"
        style={{ borderColor: set.theme.border }}
      >
        {/* Favorite Button */}
        {set.id && (
          <FavoriteButton
            setId={set.id}
            onToggle={onFavoriteToggle}
            className="absolute top-4 right-4"
          />
        )}

        {/* Artist Name */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-shadow-neon pr-12 sm:pr-16"
          style={{ color: set.theme.primary }}
        >
          {set.artist}
        </h1>

        {/* Event Info */}
        <div className="space-y-2 mb-6">
          <p className="text-lg sm:text-xl text-gray-300 font-semibold">{set.event}</p>
          {set.stage && (
            <p className="text-sm sm:text-base text-gray-400">
              <span className="text-gray-500">Stage:</span> {set.stage}
            </p>
          )}
          {set.description && (
            <p className="text-sm sm:text-base text-gray-400 mt-4">{set.description}</p>
          )}
        </div>

        {/* Statistics Panel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 mb-6">
          <div className="bg-[#0d0a1d] rounded p-2 sm:p-3">
            <p className="text-xs text-gray-500 mb-1">Duración</p>
            <p className="text-sm sm:text-lg font-bold text-cyan-400">{set.duration}</p>
          </div>
          <div className="bg-[#0d0a1d] rounded p-2 sm:p-3">
            <p className="text-xs text-gray-500 mb-1">BPM</p>
            <p className="text-sm sm:text-lg font-bold text-cyan-400">{set.bpmRange}</p>
          </div>
          <div className="bg-[#0d0a1d] rounded p-2 sm:p-3">
            <p className="text-xs text-gray-500 mb-1">Género</p>
            <p className="text-sm sm:text-lg font-bold text-cyan-400">{set.mainGenre}</p>
          </div>
          <div className="bg-[#0d0a1d] rounded p-2 sm:p-3">
            <p className="text-xs text-gray-500 mb-1">Tracks</p>
            <p className="text-sm sm:text-lg font-bold text-cyan-400">{set.totalTracks}</p>
          </div>
          <div className="bg-[#0d0a1d] rounded p-2 sm:p-3">
            <p className="text-xs text-gray-500 mb-1">NF</p>
            <p className="text-sm sm:text-lg font-bold text-orange-400">
              {set.unidentifiedTracks}
            </p>
          </div>
          <div className="bg-[#0d0a1d] rounded p-2 sm:p-3">
            <p className="text-xs text-gray-500 mb-1">Favoritos</p>
            <p className="text-sm sm:text-lg font-bold text-pink-400">
              {set.favoriteCount}
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <a
            href={getYoutubeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500/20 border border-red-500/50 rounded hover:bg-red-500/30 transition-colors min-h-[44px]"
          >
            <YoutubeIcon className="w-5 h-5 text-red-400" />
            <span className="text-sm font-semibold text-red-400">YouTube</span>
          </a>
          <a
            href={set.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded hover:bg-cyan-500/30 transition-colors min-h-[44px]"
          >
            <span className="text-sm font-semibold text-cyan-400">
              Fuente: {set.source.name}
            </span>
          </a>
        </div>
      </div>

      {/* Tracklist Table */}
      <div className="bg-[#1a1a2e] rounded-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className="sticky top-0 z-10"
              style={{ backgroundColor: set.theme.headerBG }}
            >
              <tr>
                <th className="table-cell text-left">Inicio</th>
                <th className="table-cell text-left">Canción</th>
                <th className="table-cell text-left">BPM</th>
                <th className="table-cell text-left hidden lg:table-cell">
                  Género
                </th>
                <th className="table-cell text-left">Key</th>
                <th className="table-cell text-left hidden sm:table-cell">Energía</th>
                <th className="table-cell text-left hidden md:table-cell">
                  Notas
                </th>
                <th className="table-cell text-center hidden sm:table-cell">Escuchar</th>
              </tr>
            </thead>
            <tbody>
              {set.tracklist.map((track, index) => (
                <tr key={index} className="table-row">
                  <td className="table-cell text-gray-400 text-xs sm:text-sm">
                    {track.startTime || '-'}
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm sm:text-base">{track.title}</p>
                          <p className="text-xs sm:text-sm text-gray-400">{track.artist}</p>
                        </div>
                        {/* Links de Escuchar en móvil */}
                        <div className="flex items-center gap-2 sm:hidden flex-shrink-0">
                          <a
                            href={getSpotifySearchUrl(track)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-green-400 transition-colors p-1"
                            title="Buscar en Spotify"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SpotifyIcon className="w-5 h-5" />
                          </a>
                          <a
                            href={getSoundCloudSearchUrl(track)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-orange-400 transition-colors p-1"
                            title="Buscar en SoundCloud"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SoundCloudIcon className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                      {/* Mostrar BPM y Key en móvil debajo del nombre */}
                      <div className="flex items-center gap-2 mt-1 sm:hidden">
                        {track.bpm && (
                          <span className="text-xs text-cyan-400 font-semibold">
                            {track.bpm} BPM
                          </span>
                        )}
                        {track.tone && (
                          <span
                            className="px-1.5 py-0.5 rounded text-xs font-bold"
                            style={{ backgroundColor: set.theme.camelot, color: '#0d0a1d' }}
                          >
                            {track.tone}
                          </span>
                        )}
                        {track.energy && (
                          <span
                            className="px-1.5 py-0.5 rounded text-xs font-bold"
                            style={{
                              backgroundColor: energyColors[track.energy],
                              color: '#0d0a1d',
                            }}
                          >
                            {track.energy}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell hidden sm:table-cell">
                    {track.bpm ? (
                      <span className="text-cyan-400 font-semibold">{track.bpm}</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="table-cell text-gray-300 hidden lg:table-cell">
                    {track.genre || '-'}
                  </td>
                  <td className="table-cell hidden sm:table-cell">
                    {track.tone ? (
                      <span
                        className="px-2 py-1 rounded text-xs font-bold inline-block"
                        style={{ backgroundColor: set.theme.camelot, color: '#0d0a1d' }}
                      >
                        {track.tone}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="table-cell hidden sm:table-cell">
                    {track.energy ? (
                      <span
                        className="px-2 py-1 rounded text-xs font-bold inline-block"
                        style={{
                          backgroundColor: energyColors[track.energy],
                          color: '#0d0a1d',
                        }}
                      >
                        {track.energy}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="table-cell text-sm text-gray-400 hidden md:table-cell">
                    {track.notes || '-'}
                  </td>
                  <td className="table-cell hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={getSpotifySearchUrl(track)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-green-400 transition-colors"
                        title="Buscar en Spotify"
                      >
                        <SpotifyIcon className="w-5 h-5" />
                      </a>
                      <a
                        href={getSoundCloudSearchUrl(track)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-orange-400 transition-colors"
                        title="Buscar en SoundCloud"
                      >
                        <SoundCloudIcon className="w-5 h-5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
