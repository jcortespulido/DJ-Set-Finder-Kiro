import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSets } from '../hooks/useSets';
import { createSet, deleteSet } from '../services/setsService';
import { SetFormModal } from '../components/SetFormModal';
import { AIExtractor } from '../components/AIExtractor';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SpotifyAuthButton } from '../components/SpotifyAuthButton';
import { XIcon } from '../components/icons';
import type { SetData } from '../types';

export function AdminView() {
  const { user, isAdmin } = useAuth();
  const { sets, isLoading } = useSets();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIExtractor, setShowAIExtractor] = useState(false);
  const [setToDelete, setSetToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 max-w-md mx-auto">
          <p className="text-red-400 text-lg">
            No tienes permisos para acceder al panel de administración
          </p>
        </div>
      </div>
    );
  }

  const handleCreateSet = async (setData: Partial<SetData>) => {
    if (!user) return;
    await createSet(setData as any, user.id);
    window.location.reload(); // Refresh to show new set
  };

  const handleDeleteSet = async (setId: string) => {
    setIsDeleting(true);
    try {
      await deleteSet(setId);
      setSetToDelete(null);
      window.location.reload(); // Refresh to update list
    } catch (error) {
      console.error('Error deleting set:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Panel de Administración
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-2">
            Gestiona sets, usuarios y configuración
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowAIExtractor(true)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-violet-500/20 border border-violet-500/50 rounded hover:bg-violet-500/30 text-violet-400 font-semibold transition-colors text-sm min-h-[44px]"
          >
            🤖 <span className="hidden sm:inline">Extraer con IA</span><span className="sm:hidden">IA</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 sm:flex-none btn-neon text-sm min-h-[44px]"
          >
            + <span className="hidden sm:inline">Crear Manual</span><span className="sm:hidden">Crear</span>
          </button>
        </div>
      </div>

      {/* Spotify Auth Status */}
      <div className="px-4">
        <SpotifyAuthButton />
      </div>

      {/* Divider */}
      <div className="divider-neon" />

      {/* Sets Table */}
      <div className="bg-[#1a1a2e] rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Sets ({sets.length})</h2>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : sets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">No hay sets creados todavía</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 btn-neon"
            >
              Crear Primer Set
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="table-cell text-left">Artista</th>
                  <th className="table-cell text-left">Evento</th>
                  <th className="table-cell text-left hidden md:table-cell">Fecha</th>
                  <th className="table-cell text-left hidden lg:table-cell">
                    Favoritos
                  </th>
                  <th className="table-cell text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sets.map((set) => (
                  <tr key={set.id} className="table-row">
                    <td className="table-cell">
                      <span
                        className="font-semibold"
                        style={{ color: set.theme.primary }}
                      >
                        {set.artist}
                      </span>
                    </td>
                    <td className="table-cell text-gray-300">{set.event}</td>
                    <td className="table-cell text-gray-400 hidden md:table-cell">
                      {set.date}
                    </td>
                    <td className="table-cell text-pink-400 hidden lg:table-cell">
                      {set.favoriteCount}
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => setSetToDelete(set.id || null)}
                        className="px-3 py-1 text-sm bg-red-500/20 border border-red-500/50 rounded hover:bg-red-500/30 text-red-400 transition-colors min-h-[44px]"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Extractor Modal */}
      {showAIExtractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAIExtractor(false)}
          />
          <div className="relative bg-[#1a1a2e] border-0 sm:border border-violet-500/30 sm:rounded-lg shadow-2xl w-full h-full sm:h-auto max-w-2xl sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1a1a2e] border-b border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-violet-400">
                Extractor con IA
              </h2>
              <button
                onClick={() => setShowAIExtractor(false)}
                className="text-gray-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <AIExtractor
                onExtracted={handleCreateSet}
                onCancel={() => setShowAIExtractor(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <SetFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSet}
      />

      {/* Delete Confirmation Modal */}
      {setToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSetToDelete(null)}
          />
          <div className="relative bg-[#1a1a2e] border border-red-500/50 rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-bold text-red-400 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que quieres eliminar este set? Esta acción no se
              puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSetToDelete(null)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteSet(setToDelete)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
