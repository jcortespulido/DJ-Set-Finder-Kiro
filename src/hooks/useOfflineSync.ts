import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUnsyncedFavorites, markFavoriteAsSynced } from '../services/offlineStorage';
import { toggleFavorite } from '../services/favoritesService';

/**
 * Hook to sync offline favorites when connection is restored
 */
export function useOfflineSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const syncFavorites = async () => {
      try {
        // Get unsynced favorites from IndexedDB
        const unsyncedFavorites = await getUnsyncedFavorites(user.id);

        if (unsyncedFavorites.length === 0) return;

        console.log(`Syncing ${unsyncedFavorites.length} offline favorites...`);

        // Sync each favorite
        for (const setId of unsyncedFavorites) {
          try {
            // Check if it's already in user's favorites
            const isFavorite = user.favorites.includes(setId);
            
            // If not, add it
            if (!isFavorite) {
              await toggleFavorite(user.id, setId, false);
            }

            // Mark as synced
            await markFavoriteAsSynced(setId);
          } catch (error) {
            console.error(`Error syncing favorite ${setId}:`, error);
          }
        }

        console.log('Offline favorites synced successfully');
      } catch (error) {
        console.error('Error syncing offline favorites:', error);
      }
    };

    // Sync on mount if online
    if (navigator.onLine) {
      syncFavorites();
    }

    // Sync when connection is restored
    const handleOnline = () => {
      console.log('Connection restored, syncing offline data...');
      syncFavorites();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [user]);
}
