import { useState, FormEvent } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { extractTracklistFromURL } from '../services/aiService';
import type { SetData } from '../types';

interface AIExtractorProps {
  onExtracted: (setData: Partial<SetData>) => void;
  onCancel: () => void;
}

export function AIExtractor({ onExtracted, onCancel }: AIExtractorProps) {
  const [url, setUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<Partial<SetData> | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setExtractedData(null);
    setShowPreview(false);

    // Validar URL
    if (!url.trim()) {
      setError('Por favor, ingresa una URL de YouTube, SoundCloud o el nombre del set');
      return;
    }

    setIsExtracting(true);
    setProgress(10);

    try {
      // Progreso: Validando URL
      setProgress(20);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Progreso: Conectando con IA
      setProgress(40);
      
      // Extraer con Gemini + Google Search
      const hasApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      let result;
      
      if (hasApiKey) {
        result = await extractTracklistFromURL(url);
        
        if (!result.success) {
          setError(result.error || 'No se pudo extraer el tracklist');
          return;
        }
      } else {
        setError('API key de Gemini no configurada');
        return;
      }

      setProgress(80);

      if (!result.success || !result.data) {
        setError(result.error || 'No se pudo extraer información del set');
        setProgress(0);
        return;
      }

      // Progreso: Procesando datos
      setProgress(100);
      setExtractedData(result.data);
      setShowPreview(true);

      if (!hasApiKey) {
        setError('ℹ️ Usando datos de ejemplo. Configura VITE_GEMINI_API_KEY para extracción real.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al extraer tracklist');
      setProgress(0);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSave = () => {
    if (extractedData) {
      onExtracted(extractedData);
    }
  };

  const handleReset = () => {
    setUrl('');
    setExtractedData(null);
    setShowPreview(false);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">
          Extractor de Tracklist con IA
        </h2>
        <p className="text-gray-400">
          Pega una URL de YouTube o SoundCloud y la IA extraerá automáticamente
          toda la información del set.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL o Nombre del Set
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ej: https://youtube.com/watch?v=... o 'Amelie Lens Tomorrowland 2023'"
            className="w-full px-4 py-3 bg-[#0d0a1d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
            disabled={isExtracting}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <p className="text-orange-400 text-sm">{error}</p>
          </div>
        )}

        {/* Progress Bar */}
        {isExtracting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Extrayendo tracklist...</span>
              <span className="text-cyan-400 font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all duration-300 animate-glow"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            disabled={isExtracting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isExtracting}
            className="btn-neon flex items-center gap-2"
          >
            {isExtracting ? (
              <>
                <LoadingSpinner size="sm" />
                Extrayendo...
              </>
            ) : (
              '🤖 Extraer con IA'
            )}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="bg-[#1a1a2e] border border-cyan-500/30 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-cyan-400 mb-2">
          ℹ️ Cómo funciona
        </h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Pega la URL de un set de YouTube o SoundCloud</li>
          <li>• La IA analizará el video/audio y la descripción</li>
          <li>• Extraerá automáticamente: artista, evento, tracklist, BPMs, etc.</li>
          <li>• Podrás revisar y editar antes de guardar</li>
        </ul>
      </div>

      {/* Preview Section */}
      {showPreview && extractedData && (
        <div className="space-y-4">
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">
              ✅ Extracción Completada
            </h3>
            
            {/* Set Info Preview */}
            <div className="bg-[#1a1a2e] border border-cyan-500/30 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Artista</p>
                  <p className="text-white font-semibold">{extractedData.artist}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Evento</p>
                  <p className="text-white font-semibold">{extractedData.event}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fecha</p>
                  <p className="text-white">{extractedData.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duración</p>
                  <p className="text-white">{extractedData.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Género</p>
                  <p className="text-white">{extractedData.mainGenre}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tracks</p>
                  <p className="text-cyan-400 font-semibold">
                    {extractedData.totalTracks} tracks
                  </p>
                </div>
              </div>

              {extractedData.description && (
                <div>
                  <p className="text-xs text-gray-500">Descripción</p>
                  <p className="text-gray-300 text-sm">{extractedData.description}</p>
                </div>
              )}

              {/* Tracklist Preview */}
              {extractedData.tracklist && extractedData.tracklist.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Tracklist ({extractedData.tracklist.length} tracks)
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {extractedData.tracklist.slice(0, 5).map((track, index) => (
                      <div
                        key={index}
                        className="text-sm bg-[#0d0a1d] rounded p-2"
                      >
                        <span className="text-gray-500">{track.startTime}</span>
                        <span className="text-white ml-2">
                          {track.artist} - {track.title}
                        </span>
                      </div>
                    ))}
                    {extractedData.tracklist.length > 5 && (
                      <p className="text-xs text-gray-500 text-center py-2">
                        ... y {extractedData.tracklist.length - 5} tracks más
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Extraer Otro
              </button>
              <button
                onClick={handleSave}
                className="btn-neon"
              >
                💾 Guardar Set
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      {!showPreview && (
        <div className="space-y-3">
          <div className="bg-[#1a1a2e] border border-cyan-500/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">
              🧠 Cómo funciona la IA
            </h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• La IA busca automáticamente en Google el tracklist del set</li>
              <li>• Prioriza fuentes confiables como 1001Tracklists, Set79, etc.</li>
              <li>• Extrae datos técnicos: timestamps, artistas, nombres de tracks</li>
              <li>• <strong className="text-green-400">Spotify API</strong> proporciona BPM y Key precisos</li>
              <li>• Analiza el "vibe": energía, género, momento del set</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                <strong>Ejemplos:</strong> URL de YouTube, SoundCloud, o simplemente "Amelie Lens Tomorrowland 2023"
              </p>
            </div>
          </div>

          {/* Spotify Status */}
          {import.meta.env.VITE_SPOTIFY_CLIENT_ID ? (
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
              <p className="text-cyan-400 text-sm flex items-center gap-2">
                <span>ℹ️</span>
                <span><strong>Spotify API:</strong> Conecta Spotify en Admin para obtener BPMs y Keys precisos</span>
              </p>
            </div>
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-yellow-400 text-sm">
                <strong>⚠️ Spotify API no configurada:</strong> Configura las credenciales de Spotify en el archivo .env
              </p>
            </div>
          )}
        </div>
      )}

      {/* Setup Note */}
      {!import.meta.env.VITE_GEMINI_API_KEY && !showPreview && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">
            <strong>Configuración:</strong> Para usar extracción real, agrega{' '}
            <code className="bg-black/30 px-1 rounded">VITE_GEMINI_API_KEY</code>{' '}
            a tu archivo .env con tu API key de Google Gemini.
          </p>
        </div>
      )}
    </div>
  );
}
