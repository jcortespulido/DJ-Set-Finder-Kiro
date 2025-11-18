import { useEffect } from 'react';
import { useRegisterSW as useVitePWARegisterSW } from 'virtual:pwa-register/react';

/**
 * Hook to register the service worker and handle updates
 */
export function useRegisterSW() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useVitePWARegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  useEffect(() => {
    if (offlineReady) {
      console.log('App ready to work offline');
    }
  }, [offlineReady]);

  useEffect(() => {
    if (needRefresh) {
      console.log('New content available, please refresh');
    }
  }, [needRefresh]);

  return {
    offlineReady,
    needRefresh,
    updateServiceWorker,
    close,
  };
}
