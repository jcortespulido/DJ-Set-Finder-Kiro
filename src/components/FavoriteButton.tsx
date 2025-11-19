import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toggleFavorite } from '../services/favoritesService';
import { HeartIcon } from './icons';

interface FavoriteButtonProps {
  setId: string;
  onToggle?: () => void;
  className?: string;
}

export function FavoriteButton({ setId, onToggle, className = '' }: FavoriteButtonProps) {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const isFavorite = user.favorites.includes(setId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await toggleFavorite(user.id, setId, isFavorite);
      
      // Refresh user data to update favorites
      await refreshUser();
      
      // Trigger callback to refresh data
      if (onToggle) {
        onToggle();
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar favorito');
      console.error('Error toggling favorite:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`p-2 rounded-full transition-all ${
          isFavorite
            ? 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30'
            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-pink-400'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${
          isFavorite ? 'animate-pulse-neon' : ''
        }`}
        title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <HeartIcon
          className={`w-5 h-5 transition-transform ${
            isFavorite ? 'scale-110' : 'hover:scale-110'
          }`}
          filled={isFavorite}
        />
      </button>
      
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
