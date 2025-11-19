import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase.config';
import type { SetData } from '../types';

export function useSetDetail(setId: string | null) {
  const [set, setSet] = useState<SetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!setId) {
      setSet(null);
      setIsLoading(false);
      return;
    }

    const fetchSet = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const setRef = doc(db, 'sets', setId);
        const setDoc = await getDoc(setRef);

        if (setDoc.exists()) {
          setSet({
            id: setDoc.id,
            ...setDoc.data(),
          } as SetData);
        } else {
          setError('Set no encontrado');
        }
      } catch (err) {
        console.error('Error cargando set:', err);
        setError('Error al cargar el set. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSet();
  }, [setId]);

  return { set, isLoading, error };
}
