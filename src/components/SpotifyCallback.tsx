import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../services/spotifyService';
import { LoadingSpinner } from './LoadingSpinner';

export function SpotifyCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Obtener código de la URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const errorParam = params.get('error');

      if (errorParam) {
        setError(`Error de Spotify: ${errorParam}`);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code) {
        setError('No se recibió código de autorización');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        await exchangeCodeForToken(code);
        // Redirigir al admin después de éxito
        navigate('/', { replace: true });
        // Recargar para actualizar el estado
        window.location.reload();
      } catch (err: any) {
        setError(err.message || 'Error al procesar autorización');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="bg-[#1a1a2e] border border-cyan-500/30 rounded-lg p-8 max-w-md w-full text-center">
        {error ? (
          <>
            <div className="text-red-400 text-xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirigiendo...</p>
          </>
        ) : (
          <>
            <LoadingSpinner size="lg" />
            <h2 className="text-xl font-bold text-cyan-400 mt-4 mb-2">
              Conectando con Spotify
            </h2>
            <p className="text-gray-400">
              Procesando autorización...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
