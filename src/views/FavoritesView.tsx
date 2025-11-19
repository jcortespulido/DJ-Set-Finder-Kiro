import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSets } from '../hooks/useSets';
import { SetCard } from '../components/SetCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface FavoritesViewProps {
  onSelectSet: (setId: string) => void;
}

export function FavoritesView({ onSelectSet }: FavoritesViewProps) {
  const { user } = useAuth();
  const { sets, isLoading, error } = useSets();

  // Filter sets to show only favorites
  const favoriteSets = useMemo(() => {
    if (!user) return [];
    return sets.filter((set) => user.favorites.includes(set.id || ''));
  }, [sets, user]);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">
          Debes iniciar sesión para ver tus favoritos
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          Mis Favoritos
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Sets que has marcado como favoritos.
        </p>
      </div>

      {/* Divider */}
      <div className="divider-neon" />

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Favorites Grid */}
      {favoriteSets.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-[#1a1a2e] border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-gray-400 text-lg mb-4">
              No tienes sets favoritos todavía
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Explora sets y marca tus favoritos haciendo clic en el ícono de corazón
            </p>
            <button
              onClick={() => window.location.hash = '#explore'}
              className="btn-neon"
            >
              Explorar Sets
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-400 mb-4">
            {favoriteSets.length} set{favoriteSets.length !== 1 ? 's' : ''} favorito{favoriteSets.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favoriteSets.map((set) => (
              <SetCard
                key={set.id}
                set={set}
                onClick={onSelectSet}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
