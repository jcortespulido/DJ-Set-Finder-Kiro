import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.config';
import type { User } from '../types';

/**
 * Obtener datos de un usuario por su ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const data = userDoc.data();
    return {
      id: userDoc.id,
      email: data.email,
      name: data.name,
      role: data.role,
      favorites: data.favorites || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    throw new Error('Error al obtener datos del usuario');
  }
}

/**
 * Actualizar el perfil de un usuario
 */
export async function updateUserProfile(
  userId: string,
  updates: { name?: string }
): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    throw new Error('Error al actualizar el perfil');
  }
}

/**
 * Añadir un set a favoritos
 */
export async function addFavorite(userId: string, setId: string): Promise<void> {
  try {
    // Actualizar favoritos del usuario
    await updateDoc(doc(db, 'users', userId), {
      favorites: arrayUnion(setId),
      updatedAt: serverTimestamp(),
    });
    
    // Incrementar contador en el set
    await updateDoc(doc(db, 'sets', setId), {
      favoriteCount: increment(1),
    });
  } catch (error) {
    console.error('Error añadiendo favorito:', error);
    throw new Error('Error al añadir favorito');
  }
}

/**
 * Eliminar un set de favoritos
 */
export async function removeFavorite(userId: string, setId: string): Promise<void> {
  try {
    // Actualizar favoritos del usuario
    await updateDoc(doc(db, 'users', userId), {
      favorites: arrayRemove(setId),
      updatedAt: serverTimestamp(),
    });
    
    // Decrementar contador en el set
    await updateDoc(doc(db, 'sets', setId), {
      favoriteCount: increment(-1),
    });
  } catch (error) {
    console.error('Error eliminando favorito:', error);
    throw new Error('Error al eliminar favorito');
  }
}

/**
 * Toggle favorito (añadir o eliminar)
 */
export async function toggleFavorite(
  userId: string,
  setId: string,
  isFavorite: boolean
): Promise<boolean> {
  try {
    if (isFavorite) {
      await removeFavorite(userId, setId);
      return false;
    } else {
      await addFavorite(userId, setId);
      return true;
    }
  } catch (error) {
    console.error('Error en toggle favorito:', error);
    throw error;
  }
}

/**
 * Obtener lista de favoritos de un usuario
 */
export async function getUserFavorites(userId: string): Promise<string[]> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return [];
    }
    
    return userDoc.data().favorites || [];
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    throw new Error('Error al obtener favoritos');
  }
}
