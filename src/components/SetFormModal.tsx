import { useState, FormEvent } from 'react';
import { XIcon } from './icons';
import type { SetData } from '../types';

interface SetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (setData: Partial<SetData>) => Promise<void>;
  initialData?: SetData | null;
}

export function SetFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: SetFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [artist, setArtist] = useState(initialData?.artist || '');
  const [event, setEvent] = useState(initialData?.event || '');
  const [stage, setStage] = useState(initialData?.stage || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [bpmRange, setBpmRange] = useState(initialData?.bpmRange || '');
  const [mainGenre, setMainGenre] = useState(initialData?.mainGenre || '');
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl || '');
  const [sourceName, setSourceName] = useState(initialData?.source.name || '');
  const [sourceUrl, setSourceUrl] = useState(initialData?.source.url || '');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!artist || !event || !date) {
      setError('Artista, Evento y Fecha son requeridos');
      return;
    }

    setIsLoading(true);

    try {
      const setData: Partial<SetData> = {
        artist,
        event,
        stage,
        date,
        location,
        description,
        duration,
        bpmRange,
        mainGenre,
        youtubeUrl: youtubeUrl || null,
        source: {
          name: sourceName,
          url: sourceUrl,
        },
        theme: {
          primary: '#00f2ea',
          secondary: '#d15fff',
          border: '#00f2ea',
          headerBG: '#1a1a2e',
          camelot: '#4df9ff',
          divider: '#00f2ea',
        },
        tracklist: [],
        totalTracks: 0,
        unidentifiedTracks: 0,
      };

      await onSubmit(setData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el set');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a2e] border-0 sm:border border-cyan-500/30 sm:rounded-lg shadow-2xl w-full h-full sm:h-auto max-w-2xl sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a2e] border-b border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-cyan-400">
            {initialData ? 'Editar Set' : 'Crear Nuevo Set'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Artista *
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d0a1d] border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-400 text-base"
                style={{ fontSize: '16px' }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Evento *
              </label>
              <input
                type="text"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d0a1d] border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Stage
              </label>
              <input
                type="text"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d0a1d] border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fecha *
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="ej: 2024-01-15"
                className="w-full px-3 py-2 bg-[#0d0a1d] border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Lugar
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d0a1d] border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Duración
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="ej: 2h 30m"
                className="w-full px-3 py-2 bg-[#0d0a1d] border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                BPM Range
              </label>
              <input
                type="text"
                value={bpmRange}
                onChange={(e) => setBpmRange(e.target.value)}
                placeholder="ej: 128-135"
                className="w-full px-3 py-2 bg-[#0d0a1d] border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Género Principal
              </label>
              <input
                type="text"
                value={mainGenre}
                onChange={(e) => setMainGenre(e.target.value)}
                placeholder="ej: Techno"
                className="w-full px-3 py-2 bg-[#0d0a1d] border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[#0d0a1d] border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              YouTube URL
            </label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full px-3 py-2 bg-[#0d0a1d] border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fuente (Nombre)
              </label>
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="ej: 1001Tracklists"
                className="w-full px-3 py-2 bg-[#0d0a1d] border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fuente (URL)
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d0a1d] border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-neon"
            >
              {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear Set'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
