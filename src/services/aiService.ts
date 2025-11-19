import { GoogleGenerativeAI } from '@google/generative-ai';
import type { SetData, Track } from '../types';
import { 
  enrichTracksWithSpotify, 
  calculateBPMRange,
  isSpotifyConfigured 
} from './spotifyService';

// Nota: En producción, esta API key debería estar en variables de entorno del servidor
// Por ahora, usaremos una key de prueba que el usuario debe configurar
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Lista los modelos disponibles para debugging
 * Nota: Esta función está deshabilitada ya que la API no soporta listModels
 */
export async function listAvailableModels() {
  console.log('listModels no está disponible en la versión actual de la API');
  return [];
}

interface ExtractionResult {
  success: boolean;
  data?: Partial<SetData>;
  error?: string;
}

/**
 * Extrae el ID de un video de YouTube desde una URL
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Obtiene información de un video de YouTube usando oEmbed (no requiere API key)
 */
async function getYouTubeVideoInfo(videoId: string): Promise<{ title: string; author: string } | null> {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      title: data.title || '',
      author: data.author_name || '',
    };
  } catch (error) {
    console.error('Error obteniendo info de YouTube:', error);
    return null;
  }
}

/**
 * Busca un tracklist en 1001Tracklists usando su buscador
 */
async function search1001Tracklists(artist: string, event: string): Promise<string | null> {
  try {
    const query = `${artist} ${event}`.trim();
    console.log(`🔍 Buscando en 1001Tracklists: "${query}"`);
    
    // Usar el buscador de 1001Tracklists
    const searchUrl = `https://www.1001tracklists.com/search/?query=${encodeURIComponent(query)}`;
    console.log(`📍 URL de búsqueda: ${searchUrl}`);
    
    // Retornar la URL de búsqueda para que la IA la use
    return searchUrl;
  } catch (error) {
    console.error('Error buscando en 1001Tracklists:', error);
    return null;
  }
}

/**
 * Extrae información de un set desde una URL de YouTube o SoundCloud
 */
export async function extractTracklistFromURL(url: string): Promise<ExtractionResult> {
  try {
    if (!GEMINI_API_KEY) {
      return {
        success: false,
        error: 'API key de Gemini no configurada. Agrega VITE_GEMINI_API_KEY a tu archivo .env',
      };
    }

    // Si es YouTube, obtener información del video primero
    let youtubeInfo = null;
    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
      console.log('📺 Detectado video de YouTube:', youtubeId);
      youtubeInfo = await getYouTubeVideoInfo(youtubeId);
      if (youtubeInfo) {
        console.log('✅ Info de YouTube obtenida:', youtubeInfo);
        
        // Buscar en 1001Tracklists con la info del video
        const searchUrl = await search1001Tracklists(
          youtubeInfo.author,
          youtubeInfo.title
        );
        if (searchUrl) {
          console.log(`💡 Sugerencia de búsqueda: ${searchUrl}`);
        }
      }
    }

    // Crear prompt con Google Search grounding
    console.log('🔍 Iniciando extracción con Gemini + Google Search...');
    
    // Preparar URL de búsqueda en 1001Tracklists si tenemos info de YouTube
    let searchUrl: string | null = null;
    if (youtubeInfo) {
      searchUrl = await search1001Tracklists(youtubeInfo.author, youtubeInfo.title);
    }
    
    const prompt = createExtractionPrompt(url, youtubeInfo, searchUrl);

    // Usar la librería SDK de Google con el modelo correcto
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Usar gemini-2.0-flash-exp con Google Search grounding
    const modelsToTry = [
      'gemini-2.0-flash-exp',
    ];
    
    let text = '';
    let lastError: Error | null = null;
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Intentando con modelo: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 8192,
          },
          tools: [{
            googleSearch: {}
          } as any] // Type assertion para evitar error de tipos
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        console.log(`✅ Éxito con modelo: ${modelName}`);
        console.log('📝 Respuesta de la IA:', text.substring(0, 500)); // Primeros 500 caracteres
        break; // Si funciona, salir del loop
      } catch (error: any) {
        console.log(`❌ Falló modelo ${modelName}:`, error.message);
        lastError = error;
        
        // Si es error 429 (rate limit), dar mensaje claro
        if (error.message?.includes('429') || error.message?.includes('quota')) {
          console.log('⏳ Cuota de API agotada temporalmente');
          return {
            success: false,
            error: 'Has alcanzado el límite de requests por minuto. Por favor espera 1 minuto e intenta de nuevo. El modelo gemini-2.0-flash-exp tiene límites estrictos en el tier gratuito.',
          };
        }
        
        continue; // Intentar con el siguiente modelo
      }
    }
    
    if (!text) {
      throw lastError || new Error('Ningún modelo funcionó');
    }

    // Parsear respuesta JSON
    const extractedData = parseAIResponse(text);

    if (!extractedData) {
      console.error('❌ No se pudo parsear la respuesta de la IA');
      console.error('Respuesta completa:', text);
      return {
        success: false,
        error: 'La IA no pudo extraer información de esta URL. Para mejores resultados, usa URLs de YouTube que tengan:\n• Nombre del DJ en el título\n• Nombre del evento/festival\n• Tracklist con timestamps en la descripción (ej: "00:00 Artist - Track")\n\nAlternativamente, usa el formulario manual.',
      };
    }

    // PASO 2: Enriquecer con Spotify (BPM y Key precisos)
    if (isSpotifyConfigured() && extractedData.tracklist && extractedData.tracklist.length > 0) {
      console.log('🎵 Enriqueciendo tracks con Spotify API...');
      
      try {
        const enrichedData = await enrichTracksWithSpotify(
          extractedData.tracklist.map(track => ({
            artist: track.artist,
            title: track.title,
          }))
        );

        // Aplicar datos enriquecidos a los tracks
        extractedData.tracklist = extractedData.tracklist.map((track, index) => {
          const spotifyData = enrichedData[index];
          if (spotifyData) {
            return {
              ...track,
              bpm: spotifyData.bpm,
              tone: spotifyData.key,
              // Mantener energy de la IA si existe
              energy: track.energy || undefined,
            };
          }
          return track;
        });

        // Recalcular BPM range con datos de Spotify
        const bpms = extractedData.tracklist
          .map(t => t.bpm)
          .filter((bpm): bpm is number => typeof bpm === 'number' && bpm > 0);
        
        if (bpms.length > 0) {
          extractedData.bpmRange = calculateBPMRange(bpms);
          console.log(`✅ BPM range actualizado con Spotify: ${extractedData.bpmRange}`);
        }
      } catch (error) {
        console.error('Error enriqueciendo con Spotify:', error);
        // Continuar con los datos de la IA si Spotify falla
      }
    } else if (!isSpotifyConfigured()) {
      console.warn('⚠️ Spotify no conectado. Conecta Spotify en Admin para obtener BPMs y Keys precisos.');
    }

    return {
      success: true,
      data: extractedData,
    };
  } catch (error: any) {
    console.error('Error en extracción con IA:', error);
    return {
      success: false,
      error: error.message || 'Error al extraer tracklist',
    };
  }
}

/**
 * Extrae el ID de tracklist de una URL de 1001Tracklists
 */
function extract1001TracklistsId(url: string): string | null {
  // Formato: https://www.1001tracklists.com/tracklist/{id}/...
  const match = url.match(/tracklist\/([a-z0-9]+)\//i);
  return match ? match[1] : null;
}

/**
 * Obtiene datos de tracklist usando la API no oficial de 1001Tracklists
 * Nota: Función reservada para uso futuro
 */
// @ts-ignore - Función reservada para uso futuro
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetch1001TracklistsData(url: string): Promise<any> {
  try {
    // Extraer ID de la URL
    const tracklistId = extract1001TracklistsId(url);
    
    if (!tracklistId) {
      throw new Error('No se pudo extraer el ID del tracklist de la URL');
    }
    
    console.log(`🔍 Obteniendo tracklist con ID: ${tracklistId}`);
    
    // Usar la API no oficial
    const apiUrl = `https://api.1001tracklists.com/tracklist/${tracklistId}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API respondió con status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Datos obtenidos de la API:', data);
    
    return data;
  } catch (error: any) {
    throw new Error(`Error al obtener datos de 1001Tracklists: ${error.message}`);
  }
}

/**
 * Convierte datos de la API de 1001Tracklists al formato SetData
 * Nota: Función reservada para uso futuro
 */
// @ts-ignore - Función reservada para uso futuro
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function convert1001TracklistsToSetData(apiData: any, url: string): Partial<SetData> {
  // Extraer información básica
  const artist = apiData.artist || apiData.dj || 'Unknown Artist';
  const event = apiData.event || apiData.title || 'Unknown Event';
  const date = apiData.date || new Date().toISOString().split('T')[0];
  const location = apiData.location || apiData.venue || null;
  
  // Extraer tracklist
  const tracklist: Track[] = [];
  if (apiData.tracks && Array.isArray(apiData.tracks)) {
    apiData.tracks.forEach((track: any, index: number) => {
      tracklist.push({
        startTime: track.time || track.timestamp || `${index * 5}:00`,
        title: track.title || track.name || 'Unknown Track',
        artist: track.artist || track.artists?.join(', ') || 'Unknown Artist',
        bpm: track.bpm || undefined,
        genre: track.genre || undefined,
        tone: track.key || track.tone || undefined,
        energy: undefined,
        notes: track.notes || track.label || undefined,
      });
    });
  }
  
  // Calcular duración si hay timestamps
  let duration = '0h 0m';
  if (tracklist.length > 0) {
    const lastTime = tracklist[tracklist.length - 1].startTime;
    if (lastTime) {
      const parts = lastTime.split(':');
      if (parts.length >= 2) {
        const minutes = parseInt(parts[0]) + (parts.length === 3 ? parseInt(parts[1]) : 0);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        duration = `${hours}h ${mins}m`;
      }
    }
  }
  
  // Calcular BPM range
  const bpms = tracklist.map(t => t.bpm).filter(b => b !== null) as number[];
  const bpmRange = bpms.length > 0 
    ? `${Math.min(...bpms)}-${Math.max(...bpms)}`
    : '0-0';
  
  // Determinar género principal
  const genres = tracklist.map(t => t.genre).filter(g => g !== null);
  const genreCount: Record<string, number> = {};
  genres.forEach(g => {
    if (g) genreCount[g] = (genreCount[g] || 0) + 1;
  });
  const mainGenre = Object.keys(genreCount).sort((a, b) => genreCount[b] - genreCount[a])[0] || 'Electronic';
  
  return {
    artist,
    event,
    stage: apiData.stage || '',
    date,
    location,
    description: apiData.description || null,
    duration,
    bpmRange,
    mainGenre,
    youtubeUrl: apiData.youtubeUrl || apiData.youtube || null,
    source: {
      name: '1001Tracklists',
      url: url,
    },
    theme: {
      primary: '#00f2ea',
      secondary: '#d15fff',
      border: '#00f2ea',
      headerBG: '#1a1a2e',
      camelot: '#4df9ff',
      divider: '#00f2ea',
    },
    tracklist,
    totalTracks: tracklist.length,
    unidentifiedTracks: tracklist.filter(t => 
      t.title.toLowerCase().includes('id') || 
      t.title === 'Unknown Track'
    ).length,
    favoriteCount: 0,
  };
}

/**
 * Crea el prompt para extraer datos de HTML de 1001Tracklists
 * Nota: Función reservada para uso futuro
 */
// @ts-ignore - Función reservada para uso futuro
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createScrapingPrompt(htmlContent: string, url: string): string {
  // Buscar la sección del tracklist en el HTML
  // 1001Tracklists usa clases específicas para los tracks
  const tracklistStart = htmlContent.indexOf('tlpTog');
  const relevantHtml = tracklistStart > 0 
    ? htmlContent.substring(Math.max(0, tracklistStart - 5000), tracklistStart + 45000)
    : htmlContent.substring(0, 50000);
  
  console.log(`📄 HTML relevante: ${relevantHtml.length} caracteres`);
  
  return `
Eres un experto en extracción de datos de páginas web de música electrónica. Analiza el siguiente HTML de 1001Tracklists y extrae TODA la información del set de DJ.

URL: ${url}

HTML relevante:
${relevantHtml}

INSTRUCCIONES ESPECÍFICAS PARA 1001TRACKLISTS:
1. Busca el nombre del DJ/artista en el título de la página o en elementos con clase "artistLink"
2. Busca el evento/festival en el título o breadcrumbs
3. Busca la fecha (formato YYYY-MM-DD)
4. Busca la ubicación/venue
5. **IMPORTANTE - TRACKLIST**: Busca elementos con clases como:
   - "tlpItem" o "trackItem" para cada track
   - "cueValueField" para timestamps
   - "trackFormat" o "trackValue" para nombres de canciones
   - "artistValue" para artistas
   - Busca TODOS los tracks, no solo los primeros
6. Si encuentras timestamps, úsalos para calcular la duración
7. Identifica el género musical

CRÍTICO: 
- Extrae TODOS los tracks que encuentres, no solo algunos
- Si no encuentras timestamps, usa null
- Si no encuentras BPM o Key, usa null
- Responde SOLO con JSON válido, sin texto adicional

Formato de respuesta:
{
  "artist": "Nombre del DJ",
  "event": "Nombre del evento",
  "stage": "Escenario (si está disponible)",
  "date": "YYYY-MM-DD",
  "location": "Ciudad, País",
  "description": "Descripción del set",
  "duration": "Xh Ym",
  "bpmRange": "XXX-XXX",
  "mainGenre": "Género",
  "youtubeUrl": "URL de YouTube si está disponible",
  "tracklist": [
    {
      "startTime": "MM:SS",
      "title": "Nombre de la canción",
      "artist": "Artista",
      "bpm": 128,
      "genre": "Género",
      "tone": "8A",
      "energy": "Peak",
      "notes": null
    }
  ],
  "totalTracks": 0,
  "unidentifiedTracks": 0
}
`;
}

/**
 * Crea el prompt para la extracción desde URL directa con Google Search
 */
function createExtractionPrompt(url: string, youtubeInfo?: { title: string; author: string } | null, searchUrl?: string | null): string {
  const youtubeContext = youtubeInfo 
    ? `\n\nINFORMACIÓN DEL VIDEO DE YOUTUBE:
- Título: ${youtubeInfo.title}
- Canal: ${youtubeInfo.author}

IMPORTANTE: Usa esta información como base para tu búsqueda. El título del video suele contener el nombre del DJ, evento y fecha.`
    : '';

  const searchContext = searchUrl
    ? `\n\n🎯 BÚSQUEDA DIRECTA EN 1001TRACKLISTS:
He preparado esta búsqueda para ti: ${searchUrl}

INSTRUCCIÓN CRÍTICA: 
1. Visita esta URL de búsqueda
2. Encuentra el tracklist correcto en los resultados
3. Abre la página del tracklist
4. COPIA los BPMs y Keys exactos de cada track
5. Si no encuentras el tracklist aquí, busca en Set79.com`
    : '';

  return `
Eres un experto investigador de música electrónica y sets de DJ. Tu tarea es encontrar y extraer TODA la información de un set usando búsquedas en Google.

URL proporcionada: ${url}${youtubeContext}${searchContext}

METODOLOGÍA DE INVESTIGACIÓN:

1. 🕵️ BÚSQUEDA DE LA FUENTE (PASO A PASO):
   - **PASO 1**: Busca en Google: "site:1001tracklists.com [nombre del artista] [evento]"
   - **PASO 2**: Si encuentras el tracklist en 1001Tracklists, ÚSALO como fuente principal (tiene BPM y Keys)
   - **PASO 3**: Si no está en 1001Tracklists, busca: "site:set79.com [nombre del artista] [evento]"
   - **PASO 4**: Si es YouTube y tiene timestamps en la descripción, úsalos para los tracks
   - **PASO 5**: Para BPMs faltantes, busca cada track individual en Beatport o 1001Tracklists
   - **IMPORTANTE**: 1001Tracklists y Set79 son las ÚNICAS fuentes confiables para BPM y Key

2. 🎼 EXTRACCIÓN DE DATOS DUROS (CRÍTICO):
   - Time (timestamps): ¿En qué minuto entra cada canción?
   - ID: Nombre del Artista y Título de la canción
   - Remixes: Identifica si es remix específico
   - **BPM (OBLIGATORIO)**: 
     * Busca ESPECÍFICAMENTE en 1001Tracklists.com el tracklist completo
     * Busca en Set79.com como alternativa
     * Si encuentras el tracklist en estas plataformas, COPIA los BPMs exactos
     * Si no encuentras BPM específico, estima basándote en el género:
       - Techno: 125-135 BPM
       - Tech House: 120-128 BPM
       - Trance: 130-140 BPM
       - Melodic Techno: 120-125 BPM
   - **Tono/Key (OBLIGATORIO)**: 
     * Busca ESPECÍFICAMENTE en 1001Tracklists.com (tienen Keys en formato Camelot)
     * Busca en Beatport si no encuentras en 1001Tracklists
     * Si no encuentras, usa null (NO inventes Keys)

3. ⚡ ANÁLISIS CURATORIAL (Vibe):
   - Género: Tech House, Melodic Techno, Trance, etc.
   - Energía: Asigna según posición en el set:
     * Intro: Primeras canciones
     * Groove: Desarrollo del set
     * Peak: Momento álgido
     * Buildup: Construcción de energía
     * Anthem: Clásicos que todos conocen
     * Cierre: Últimas canciones

4. 💎 COMPILACIÓN FINAL:
   - Extrae TODOS los tracks que encuentres
   - Incluye toda la metadata del evento
   - Estructura en JSON

IMPORTANTE: 
- USA GOOGLE SEARCH para encontrar la información
- **PRIORIDAD ABSOLUTA**: Busca el tracklist en 1001Tracklists.com o Set79.com
- Si encuentras el tracklist en estas plataformas, COPIA los BPMs y Keys exactos
- Si no encuentras BPM/Key después de buscar exhaustivamente, usa null
- Responde SOLO con JSON válido

EJEMPLO DE BÚSQUEDA EXITOSA:
Si el set es "Amelie Lens Tomorrowland 2023":
1. Busca: "site:1001tracklists.com amelie lens tomorrowland 2023"
2. Encuentra: https://www.1001tracklists.com/tracklist/2abc123/amelie-lens-tomorrowland-2023.html
3. En esa página verás cada track con su BPM y Key
4. COPIA esos datos exactos al JSON

Por favor, extrae la siguiente información:
- artist: Nombre del DJ/artista
- event: Nombre del evento o festival
- stage: Escenario (si está disponible)
- date: Fecha del set (formato YYYY-MM-DD si es posible)
- location: Ubicación del evento
- description: Descripción breve del set
- duration: Duración total (formato "Xh Ym")
- bpmRange: Rango de BPM (formato "XXX-XXX")
- mainGenre: Género musical principal
- youtubeUrl: URL del video (si es YouTube)
- tracklist: Array de tracks con:
  - startTime: Tiempo de inicio (formato "MM:SS")
  - title: Título de la canción
  - artist: Artista de la canción
  - **bpm: BPM (número, OBLIGATORIO si encuentras el tracklist en 1001Tracklists/Set79)**
  - genre: Género
  - **tone: Tono/Key (formato Camelot "8A", "10B", etc. - OBLIGATORIO si está en 1001Tracklists)**
  - energy: Nivel de energía ("Intro", "Groove", "Peak", "Buildup", "Anthem", "Cierre")
  - notes: Notas adicionales (ej: "Remix", "VIP Mix", "ID")

IMPORTANTE:
1. Responde SOLO con JSON válido, sin texto adicional
2. Si no encuentras algún dato, usa null
3. Para el tracklist, extrae todos los tracks que puedas identificar
4. Si no hay tracklist disponible, usa un array vacío []
5. Calcula totalTracks y unidentifiedTracks basándote en el tracklist

Formato de respuesta esperado:
{
  "artist": "string",
  "event": "string",
  "stage": "string | null",
  "date": "string",
  "location": "string | null",
  "description": "string | null",
  "duration": "string",
  "bpmRange": "string",
  "mainGenre": "string",
  "youtubeUrl": "string | null",
  "tracklist": [
    {
      "startTime": "00:00",
      "title": "Track Name",
      "artist": "Artist Name",
      "bpm": 128,
      "genre": "Techno",
      "tone": "8A",
      "energy": "Peak",
      "notes": null
    }
  ],
  "totalTracks": 0,
  "unidentifiedTracks": 0
}
`;
}

/**
 * Parsea la respuesta de la IA
 */
function parseAIResponse(text: string): Partial<SetData> | null {
  try {
    // Limpiar el texto (remover markdown code blocks si existen)
    let cleanText = text.trim();
    
    // Remover bloques de código markdown
    if (cleanText.includes('```')) {
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    // Buscar el primer { y el último } para extraer solo el JSON
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }
    
    console.log('🔍 Intentando parsear JSON:', cleanText.substring(0, 200));

    const data = JSON.parse(cleanText);

    // Log de datos extraídos para debugging
    console.log('📊 Datos extraídos por la IA:');
    console.log('  - Artist:', data.artist);
    console.log('  - Event:', data.event);
    console.log('  - BPM Range:', data.bpmRange);
    console.log('  - Tracks:', data.tracklist?.length || 0);
    if (data.tracklist && data.tracklist.length > 0) {
      const tracksWithBpm = data.tracklist.filter((t: any) => t.bpm).length;
      const tracksWithKey = data.tracklist.filter((t: any) => t.tone).length;
      console.log(`  - Tracks con BPM: ${tracksWithBpm}/${data.tracklist.length}`);
      console.log(`  - Tracks con Key: ${tracksWithKey}/${data.tracklist.length}`);
    }

    // Validar estructura básica
    // Si todos los campos importantes son null, la IA no pudo extraer nada
    if (!data.artist && !data.event && (!data.tracklist || data.tracklist.length === 0)) {
      console.warn('⚠️ La IA no encontró información en esta URL');
      return null;
    }
    
    // Si al menos tiene algo de información, continuar
    if (!data.artist) data.artist = 'Unknown Artist';
    if (!data.event) data.event = 'Unknown Event';

    // Calcular totalTracks y unidentifiedTracks
    const tracklist: Track[] = data.tracklist || [];
    const totalTracks = tracklist.length;
    const unidentifiedTracks = tracklist.filter(
      (track) => !track.title || track.title.toLowerCase().includes('id') || track.title === 'Unknown'
    ).length;

    // Calcular BPM range desde los tracks si no viene en la respuesta
    let bpmRange = data.bpmRange || '0-0';
    if (bpmRange === '0-0' && tracklist.length > 0) {
      const bpms = tracklist
        .map(t => t.bpm)
        .filter((bpm): bpm is number => typeof bpm === 'number' && bpm > 0);
      
      if (bpms.length > 0) {
        const minBpm = Math.min(...bpms);
        const maxBpm = Math.max(...bpms);
        bpmRange = `${minBpm}-${maxBpm}`;
        console.log(`✅ BPM range calculado desde tracks: ${bpmRange}`);
      }
    }

    // Crear objeto SetData parcial
    const setData: Partial<SetData> = {
      artist: data.artist,
      event: data.event,
      stage: data.stage || '',
      date: data.date || new Date().toISOString().split('T')[0],
      location: data.location || '',
      description: data.description || '',
      duration: data.duration || '0h 0m',
      bpmRange,
      mainGenre: data.mainGenre || 'Unknown',
      youtubeUrl: data.youtubeUrl || null,
      source: {
        name: 'AI Extraction',
        url: data.youtubeUrl || '',
      },
      theme: {
        primary: '#00f2ea',
        secondary: '#d15fff',
        border: '#00f2ea',
        headerBG: '#1a1a2e',
        camelot: '#4df9ff',
        divider: '#00f2ea',
      },
      tracklist,
      totalTracks,
      unidentifiedTracks,
      favoriteCount: 0,
    };

    return setData;
  } catch (error) {
    console.error('Error parseando respuesta de IA:', error);
    return null;
  }
}

/**
 * Extrae información desde texto pegado (tracklist copiado)
 */
export async function extractTracklistFromText(text: string, referenceUrl: string = ''): Promise<ExtractionResult> {
  try {
    if (!GEMINI_API_KEY) {
      return {
        success: false,
        error: 'API key de Gemini no configurada',
      };
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 1,
        maxOutputTokens: 8192,
      }
    });

    const prompt = `
Eres un experto en música electrónica. Analiza el siguiente tracklist pegado por un usuario y extrae TODA la información en formato JSON estructurado.

TRACKLIST:
${text}

${referenceUrl ? `URL de referencia: ${referenceUrl}` : ''}

INSTRUCCIONES:
1. Identifica el nombre del DJ/artista (puede estar en el texto o deducirlo del contexto)
2. Identifica el evento/festival si está mencionado
3. Extrae TODOS los tracks con:
   - Timestamps (formato MM:SS o HH:MM:SS) si están disponibles
   - Nombre completo de la canción
   - Artista de cada track
   - Separa correctamente "Artist - Track Name"
4. Si encuentras BPM, Key o género, inclúyelos
5. Calcula duración total si hay timestamps
6. Cuenta tracks totales y no identificados

IMPORTANTE: Responde SOLO con JSON válido, sin texto adicional.

Formato:
{
  "artist": "Nombre del DJ",
  "event": "Evento (o null)",
  "stage": null,
  "date": "YYYY-MM-DD (o null)",
  "location": null,
  "description": null,
  "duration": "Xh Ym",
  "bpmRange": "XXX-XXX",
  "mainGenre": "Género",
  "youtubeUrl": "${referenceUrl || null}",
  "tracklist": [
    {
      "startTime": "MM:SS",
      "title": "Track Name",
      "artist": "Artist Name",
      "bpm": null,
      "genre": null,
      "tone": null,
      "energy": null,
      "notes": null
    }
  ],
  "totalTracks": 0,
  "unidentifiedTracks": 0
}
`;

    console.log('🤖 Extrayendo desde texto...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();
    
    console.log('📝 Respuesta de la IA:', aiText.substring(0, 500));

    const extractedData = parseAIResponse(aiText);

    if (!extractedData) {
      return {
        success: false,
        error: 'No se pudo estructurar el tracklist. Verifica que el formato sea correcto.',
      };
    }

    return {
      success: true,
      data: extractedData,
    };
  } catch (error: any) {
    console.error('Error en extracción desde texto:', error);
    return {
      success: false,
      error: error.message || 'Error al procesar el tracklist',
    };
  }
}

/**
 * Simula extracción para testing (sin API key)
 * Nota: Esta es una implementación funcional que permite a los usuarios
 * probar la app mientras se configura la API real de Gemini
 */
export async function mockExtractTracklist(url: string): Promise<ExtractionResult> {
  // Simular delay de API realista
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Extraer información básica de la URL si es posible
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isSoundCloud = url.includes('soundcloud.com');
  
  return {
    success: true,
    data: {
      artist: 'DJ Set Example',
      event: 'Demo Festival 2024',
      stage: 'Main Stage',
      date: new Date().toISOString().split('T')[0],
      location: 'Demo Location',
      description: `Set extraído en modo demo desde ${isYouTube ? 'YouTube' : isSoundCloud ? 'SoundCloud' : 'URL'}. Configura tu API key de Gemini para extracción real con IA.`,
      duration: '2h 15m',
      bpmRange: '128-135',
      mainGenre: 'Electronic',
      youtubeUrl: isYouTube ? url : null,
      source: {
        name: 'Demo Mode',
        url: url,
      },
      theme: {
        primary: '#00f2ea',
        secondary: '#d15fff',
        border: '#00f2ea',
        headerBG: '#1a1a2e',
        camelot: '#4df9ff',
        divider: '#00f2ea',
      },
      tracklist: [
        {
          startTime: '00:00',
          title: 'Intro Track',
          artist: 'Demo Artist 1',
          bpm: 128,
          genre: 'Techno',
          tone: '8A',
          energy: 'Intro',
          notes: undefined,
        },
        {
          startTime: '05:30',
          title: 'Building Energy',
          artist: 'Demo Artist 2',
          bpm: 130,
          genre: 'Techno',
          tone: '8B',
          energy: 'Buildup',
          notes: undefined,
        },
        {
          startTime: '12:00',
          title: 'Peak Moment',
          artist: 'Demo Artist 3',
          bpm: 132,
          genre: 'Techno',
          tone: '9A',
          energy: 'Peak',
          notes: 'Main drop',
        },
        {
          startTime: '18:30',
          title: 'Groove Section',
          artist: 'Demo Artist 4',
          bpm: 131,
          genre: 'Tech House',
          tone: '9B',
          energy: 'Groove',
          notes: undefined,
        },
        {
          startTime: '25:00',
          title: 'Closing Track',
          artist: 'Demo Artist 5',
          bpm: 128,
          genre: 'Melodic Techno',
          tone: '8A',
          energy: 'Cierre',
          notes: 'Beautiful melody',
        },
      ],
      totalTracks: 5,
      unidentifiedTracks: 0,
      favoriteCount: 0,
    },
  };
}
