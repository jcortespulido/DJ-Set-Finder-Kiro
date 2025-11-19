/**
 * Spotify API Service
 * 
 * Este servicio maneja la integración con Spotify Web API para obtener:
 * - BPM (tempo) de tracks
 * - Key y Mode (convertidos a formato Camelot)
 * - Energy levels
 * - Géneros de artistas
 */

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '';
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:5173/callback';

interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

interface SpotifyTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  uri: string;
}

interface SpotifyAudioFeatures {
  tempo: number; // BPM
  key: number; // 0-11 (C, C#, D, etc.)
  mode: number; // 0 = Minor, 1 = Major
  energy: number; // 0.0 - 1.0
  danceability: number;
  valence: number; // Positividad musical
}

interface EnrichedTrackData {
  bpm: number;
  key: string; // Formato Camelot (ej: "8A", "10B")
  energy: number;
  genre?: string;
}

/**
 * Tabla de conversión de Spotify Key a Camelot Wheel
 * 
 * Spotify Key: 0=C, 1=C#, 2=D, 3=D#, 4=E, 5=F, 6=F#, 7=G, 8=G#, 9=A, 10=A#, 11=B
 * Mode: 0=Minor (A), 1=Major (B)
 */
const CAMELOT_CONVERSION = {
  major: ['8B', '3B', '10B', '5B', '12B', '7B', '2B', '9B', '4B', '11B', '6B', '1B'],
  minor: ['5A', '12A', '7A', '2A', '9A', '4A', '11A', '6A', '1A', '8A', '3A', '10A'],
};

// Storage key para el token
const SPOTIFY_TOKEN_KEY = 'spotify_token_data';

/**
 * Genera el URL de autorización de Spotify
 */
export function getSpotifyAuthUrl(): string {
  const scopes = [
    'user-read-private',
    'user-read-email',
  ];
  
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: scopes.join(' '),
    show_dialog: 'true',
  });
  
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Intercambia el código de autorización por tokens
 */
export async function exchangeCodeForToken(code: string): Promise<void> {
  try {
    console.log('🎵 Intercambiando código por token...');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    const data: SpotifyAuthResponse = await response.json();
    
    // Guardar tokens en localStorage
    const tokenData: SpotifyTokenData = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || '',
      expires_at: Date.now() + (data.expires_in * 1000),
    };
    
    localStorage.setItem(SPOTIFY_TOKEN_KEY, JSON.stringify(tokenData));
    console.log('✅ Token de Spotify guardado');
  } catch (error: any) {
    console.error('Error intercambiando código:', error);
    throw new Error(`No se pudo obtener token: ${error.message}`);
  }
}

/**
 * Refresca el access token usando el refresh token
 */
async function refreshSpotifyToken(): Promise<string> {
  const storedData = localStorage.getItem(SPOTIFY_TOKEN_KEY);
  if (!storedData) {
    throw new Error('No hay refresh token disponible');
  }

  const tokenData: SpotifyTokenData = JSON.parse(storedData);
  
  try {
    console.log('🔄 Refrescando token de Spotify...');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokenData.refresh_token,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data: SpotifyAuthResponse = await response.json();
    
    // Actualizar token
    tokenData.access_token = data.access_token;
    tokenData.expires_at = Date.now() + (data.expires_in * 1000);
    
    localStorage.setItem(SPOTIFY_TOKEN_KEY, JSON.stringify(tokenData));
    console.log('✅ Token refrescado');
    
    return data.access_token;
  } catch (error: any) {
    console.error('Error refrescando token:', error);
    // Si falla el refresh, limpiar y pedir re-autenticación
    localStorage.removeItem(SPOTIFY_TOKEN_KEY);
    throw new Error('Token expirado. Por favor, vuelve a autorizar Spotify.');
  }
}

/**
 * Obtiene un access token válido (refresca si es necesario)
 */
async function getSpotifyToken(): Promise<string> {
  const storedData = localStorage.getItem(SPOTIFY_TOKEN_KEY);
  
  if (!storedData) {
    throw new Error('No estás autenticado con Spotify. Por favor, autoriza la aplicación.');
  }

  const tokenData: SpotifyTokenData = JSON.parse(storedData);
  
  // Si el token está por expirar (menos de 5 minutos), refrescarlo
  if (Date.now() >= tokenData.expires_at - 300000) {
    return await refreshSpotifyToken();
  }
  
  return tokenData.access_token;
}

/**
 * Verifica si el usuario está autenticado con Spotify
 */
export function isSpotifyAuthenticated(): boolean {
  const storedData = localStorage.getItem(SPOTIFY_TOKEN_KEY);
  return !!storedData;
}

/**
 * Cierra sesión de Spotify (elimina tokens)
 */
export function logoutSpotify(): void {
  localStorage.removeItem(SPOTIFY_TOKEN_KEY);
  console.log('🚪 Sesión de Spotify cerrada');
}

/**
 * Busca un track en Spotify por artista y título
 */
export async function searchSpotifyTrack(artist: string, title: string): Promise<string | null> {
  try {
    const token = await getSpotifyToken();
    
    // Limpiar el título de remixes y versiones para mejor búsqueda
    const cleanTitle = title
      .replace(/\(.*?\)/g, '') // Remover paréntesis
      .replace(/\[.*?\]/g, '') // Remover corchetes
      .trim();
    
    const query = `artist:${artist} track:${cleanTitle}`;
    const encodedQuery = encodeURIComponent(query);
    
    console.log(`🔍 Buscando en Spotify: "${query}"`);
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.warn(`Spotify search failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data.tracks?.items?.length > 0) {
      const track: SpotifyTrack = data.tracks.items[0];
      console.log(`✅ Track encontrado: ${track.name} - ${track.artists[0].name}`);
      return track.id;
    }

    console.warn(`⚠️ Track no encontrado en Spotify: ${artist} - ${title}`);
    return null;
  } catch (error: any) {
    console.error('Error buscando track en Spotify:', error);
    return null;
  }
}

/**
 * Obtiene las audio features de un track de Spotify
 */
export async function getSpotifyAudioFeatures(trackId: string): Promise<SpotifyAudioFeatures | null> {
  try {
    const token = await getSpotifyToken();
    
    const response = await fetch(
      `https://api.spotify.com/v1/audio-features/${trackId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.warn(`Spotify audio features failed: ${response.status}`);
      return null;
    }

    const data: SpotifyAudioFeatures = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error obteniendo audio features:', error);
    return null;
  }
}

/**
 * Convierte Spotify Key y Mode a formato Camelot
 */
export function convertToCamelot(key: number, mode: number): string {
  if (key < 0 || key > 11) {
    return 'Unknown';
  }
  
  const table = mode === 1 ? CAMELOT_CONVERSION.major : CAMELOT_CONVERSION.minor;
  return table[key];
}

/**
 * Enriquece un track con datos de Spotify (BPM, Key, Energy)
 */
export async function enrichTrackWithSpotify(
  artist: string,
  title: string
): Promise<EnrichedTrackData | null> {
  try {
    // Paso 1: Buscar el track
    const trackId = await searchSpotifyTrack(artist, title);
    if (!trackId) {
      return null;
    }

    // Paso 2: Obtener audio features
    const features = await getSpotifyAudioFeatures(trackId);
    if (!features) {
      return null;
    }

    // Paso 3: Convertir a formato Camelot
    const camelotKey = convertToCamelot(features.key, features.mode);

    // Paso 4: Redondear BPM
    const bpm = Math.round(features.tempo);

    console.log(`📊 Datos enriquecidos: BPM=${bpm}, Key=${camelotKey}, Energy=${features.energy.toFixed(2)}`);

    return {
      bpm,
      key: camelotKey,
      energy: features.energy,
    };
  } catch (error: any) {
    console.error('Error enriqueciendo track:', error);
    return null;
  }
}

/**
 * Enriquece múltiples tracks en batch (con rate limiting)
 */
export async function enrichTracksWithSpotify(
  tracks: Array<{ artist: string; title: string }>
): Promise<Array<EnrichedTrackData | null>> {
  console.log(`🎵 Enriqueciendo ${tracks.length} tracks con Spotify...`);
  
  const results: Array<EnrichedTrackData | null> = [];
  
  // Procesar en lotes de 5 para no saturar la API
  const batchSize = 5;
  for (let i = 0; i < tracks.length; i += batchSize) {
    const batch = tracks.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(
      batch.map(track => enrichTrackWithSpotify(track.artist, track.title))
    );
    
    results.push(...batchResults);
    
    // Pequeña pausa entre batches
    if (i + batchSize < tracks.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  const successCount = results.filter(r => r !== null).length;
  console.log(`✅ Enriquecidos ${successCount}/${tracks.length} tracks`);
  
  return results;
}

/**
 * Calcula el BPM range de un array de BPMs
 */
export function calculateBPMRange(bpms: number[]): string {
  if (bpms.length === 0) return '0-0';
  
  const validBpms = bpms.filter(bpm => bpm > 0);
  if (validBpms.length === 0) return '0-0';
  
  const min = Math.min(...validBpms);
  const max = Math.max(...validBpms);
  
  return `${min}-${max}`;
}

/**
 * Verifica si las credenciales de Spotify están configuradas
 */
export function isSpotifyConfigured(): boolean {
  return !!(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET) && isSpotifyAuthenticated();
}
