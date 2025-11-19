import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.config';
import type { SetData } from '../types';

/**
 * Create a new set
 */
export async function createSet(
  setData: Omit<SetData, 'id' | 'createdAt' | 'updatedAt' | 'favoriteCount'>,
  userId: string
): Promise<string> {
  try {
    const setsRef = collection(db, 'sets');
    const docRef = await addDoc(setsRef, {
      ...setData,
      createdBy: userId,
      favoriteCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating set:', error);
    throw new Error('Error al crear el set');
  }
}

/**
 * Update an existing set
 */
export async function updateSet(
  setId: string,
  setData: Partial<SetData>
): Promise<void> {
  try {
    const setRef = doc(db, 'sets', setId);
    await updateDoc(setRef, {
      ...setData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating set:', error);
    throw new Error('Error al actualizar el set');
  }
}

/**
 * Delete a set
 */
export async function deleteSet(setId: string): Promise<void> {
  try {
    const setRef = doc(db, 'sets', setId);
    await deleteDoc(setRef);
  } catch (error) {
    console.error('Error deleting set:', error);
    throw new Error('Error al eliminar el set');
  }
}
