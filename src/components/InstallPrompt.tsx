import { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-[#1a1a2e] border border-cyan-500/50 rounded-lg shadow-lg p-4 animate-glow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-cyan-400">
            Instalar Set Finder
          </h3>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-300 mb-4">
          Instala la app para acceder rápidamente y usarla sin conexión.
        </p>
        <button
          onClick={handleInstall}
          className="w-full btn-neon"
        >
          Instalar App
        </button>
      </div>
    </div>
  );
}
