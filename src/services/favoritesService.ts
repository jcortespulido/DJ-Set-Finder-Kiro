import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from './firebase.config';
import { saveFavoriteOffline, removeFavoriteOffline } from './offlineStorage';

/**
 * Toggle favorite status for a set
 * @param userId - User ID
 * @param setId - Set ID
 * @param isFavorite - Current favorite status
 */
export async function toggleFavorite(
  userId: string,
  setId: string,
  isFavorite: boolean
): Promise<void> {
  try {
    // If offline, save to IndexedDB
    if (!navigator.onLine) {
      if (isFavorite) {
        await removeFavoriteOffline(setId);
      } else {
        await saveFavoriteOffline(userId, setId);
      }
      console.log('Favorite saved offline, will sync when online');
      return;
    }

    // If online, update Firestore
    // Update user's favorites array
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favorites: isFavorite ? arrayRemove(setId) : arrayUnion(setId),
    });

    // Update set's favorite count
    const setRef = doc(db, 'sets', setId);
    await updateDoc(setRef, {
      favoriteCount: increment(isFavorite ? -1 : 1),
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    
    // If error is network-related, save offline
    if (error instanceof Error && error.message.includes('network')) {
      if (isFavorite) {
        await removeFavoriteOffline(setId);
      } else {
        await saveFavoriteOffline(userId, setId);
      }
      console.log('Network error, favorite saved offline');
      return;
    }
    
    throw new Error('Error al actualizar favorito');
  }
}
