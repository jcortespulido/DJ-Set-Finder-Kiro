import { useState, useEffect } from 'react';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-orange-500/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2">
        <p className="text-center text-sm font-semibold text-white">
          ⚠️ Sin conexión a internet. Algunas funciones pueden no estar disponibles.
        </p>
      </div>
    </div>
  );
}
