import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SetFinderDB extends DBSchema {
  favorites: {
    key: string;
    value: {
      setId: string;
      userId: string;
      timestamp: number;
      synced: boolean;
    };
  };
  sets: {
    key: string;
    value: {
      id: string;
      data: any;
      timestamp: number;
    };
  };
}

const DB_NAME = 'set-finder-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<SetFinderDB> | null = null;

/**
 * Initialize IndexedDB
 */
async function getDB(): Promise<IDBPDatabase<SetFinderDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<SetFinderDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create favorites store
      if (!db.objectStoreNames.contains('favorites')) {
        db.createObjectStore('favorites', {
          keyPath: 'setId',
        });
      }

      // Create sets cache store
      if (!db.objectStoreNames.contains('sets')) {
        db.createObjectStore('sets', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

/**
 * Save favorite offline
 */
export async function saveFavoriteOffline(
  userId: string,
  setId: string
): Promise<void> {
  const db = await getDB();
  await db.put('favorites', {
    setId,
    userId,
    timestamp: Date.now(),
    synced: false,
  });
}

/**
 * Remove favorite offline
 */
export async function removeFavoriteOffline(setId: string): Promise<void> {
  const db = await getDB();
  await db.delete('favorites', setId);
}

/**
 * Get all unsynced favorites
 */
export async function getUnsyncedFavorites(
  userId: string
): Promise<string[]> {
  const db = await getDB();
  const favorites = await db.getAll('favorites');

  return favorites
    .filter((fav) => fav.userId === userId && !fav.synced)
    .map((fav) => fav.setId);
}

/**
 * Mark favorite as synced
 */
export async function markFavoriteAsSynced(setId: string): Promise<void> {
  const db = await getDB();
  const favorite = await db.get('favorites', setId);
  
  if (favorite) {
    favorite.synced = true;
    await db.put('favorites', favorite);
  }
}

/**
 * Get all favorites for a user (including offline)
 */
export async function getAllFavorites(userId: string): Promise<string[]> {
  const db = await getDB();
  const favorites = await db.getAll('favorites');

  return favorites
    .filter((fav) => fav.userId === userId)
    .map((fav) => fav.setId);
}

/**
 * Cache a set for offline access
 */
export async function cacheSet(setId: string, setData: any): Promise<void> {
  const db = await getDB();
  await db.put('sets', {
    id: setId,
    data: setData,
    timestamp: Date.now(),
  });
}

/**
 * Get cached set
 */
export async function getCachedSet(setId: string): Promise<any | null> {
  const db = await getDB();
  const cached = await db.get('sets', setId);
  return cached?.data || null;
}

/**
 * Clear old cache (older than 7 days)
 */
export async function clearOldCache(): Promise<void> {
  const db = await getDB();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const tx = db.transaction('sets', 'readwrite');
  const sets = await tx.store.getAll();

  for (const set of sets) {
    if (set.timestamp < sevenDaysAgo) {
      await tx.store.delete(set.id);
    }
  }
}
