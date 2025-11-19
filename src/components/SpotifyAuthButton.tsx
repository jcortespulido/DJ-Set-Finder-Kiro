import { useState } from 'react';
import { 
  getSpotifyAuthUrl, 
  isSpotifyAuthenticated, 
  logoutSpotify 
} from '../services/spotifyService';

export function SpotifyAuthButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(isSpotifyAuthenticated());

  const handleLogin = () => {
    const authUrl = getSpotifyAuthUrl();
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    logoutSpotify();
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-green-400 font-semibold">Spotify Conectado</p>
              <p className="text-sm text-gray-400">
                Puedes extraer BPMs y Keys precisos
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded hover:bg-red-500/30 transition-colors text-red-400 text-sm font-semibold"
          >
            Desconectar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-yellow-400 font-semibold">Spotify No Conectado</p>
            <p className="text-sm text-gray-400">
              Conecta Spotify para obtener BPMs y Keys precisos
            </p>
          </div>
        </div>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded hover:bg-green-500/30 transition-colors text-green-400 text-sm font-semibold flex items-center gap-2"
        >
          <span>🎵</span>
          Conectar Spotify
        </button>
      </div>
    </div>
  );
}
