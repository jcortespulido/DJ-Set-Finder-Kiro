import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase.config';
import type { SetData } from '../types';

export function useSets(limitCount?: number) {
  const [sets, setSets] = useState<SetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Query para obtener sets ordenados por fecha de creación
        const setsRef = collection(db, 'sets');
        let q = query(setsRef, orderBy('createdAt', 'desc'));

        // Si se especifica un límite, aplicarlo
        if (limitCount) {
          q = query(q, limit(limitCount));
        }

        const querySnapshot = await getDocs(q);
        const setsData: SetData[] = [];

        querySnapshot.forEach((doc) => {
          setsData.push({
            id: doc.id,
            ...doc.data(),
          } as SetData);
        });

        setSets(setsData);
      } catch (err) {
        console.error('Error cargando sets:', err);
        setError('Error al cargar los sets. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSets();
  }, [limitCount]);

  return { sets, isLoading, error };
}
