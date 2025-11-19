# Configuración de Spotify API

## ¿Por qué Spotify API?

Spotify API nos proporciona datos **oficiales y precisos** de:
- **BPM (Tempo)**: Beats por minuto exactos de cada track
- **Key**: Tonalidad musical (convertida a formato Camelot)
- **Energy**: Nivel de energía del track (0.0 - 1.0)
- **Danceability**: Qué tan bailable es el track
- **Valence**: Positividad musical

Esto es **mucho más confiable** que depender de Google Search o scraping.

---

## Paso 1: Crear una App en Spotify Developer

### 1.1 Ir al Dashboard
Visita: https://developer.spotify.com/dashboard

### 1.2 Iniciar Sesión
- Usa tu cuenta de Spotify (gratuita o premium)
- Si no tienes cuenta, créala en https://spotify.com

### 1.3 Crear una App
1. Click en **"Create app"**
2. Completa el formulario:
   - **App name**: `Set Finder` (o el nombre que prefieras)
   - **App description**: `DJ Set tracklist finder with BPM and Key detection`
   - **Redirect URIs**: `http://localhost:5173` (para desarrollo local)
   - **APIs used**: Marca **"Web API"**
3. Acepta los términos de servicio
4. Click en **"Save"**

### 1.4 Obtener Credenciales
1. En la página de tu app, verás:
   - **Client ID**: Una cadena alfanumérica larga
   - **Client Secret**: Click en "Show client secret" para verla
2. **IMPORTANTE**: Guarda estas credenciales de forma segura

---

## Paso 2: Configurar en tu Proyecto

### 2.1 Abrir archivo `.env`
En la raíz de tu proyecto, abre el archivo `.env` (o créalo si no existe)

### 2.2 Agregar Credenciales
```env
# Spotify API Configuration
VITE_SPOTIFY_CLIENT_ID=tu_client_id_aqui
VITE_SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
```

**Ejemplo**:
```env
VITE_SPOTIFY_CLIENT_ID=abc123def456ghi789jkl012mno345pq
VITE_SPOTIFY_CLIENT_SECRET=xyz789uvw456rst123opq890lmn567ab
```

### 2.3 Reiniciar el Servidor
```bash
# Detener el servidor (Ctrl+C)
# Iniciar de nuevo
npm run dev
```

---

## Paso 3: Verificar Configuración

### 3.1 Abrir la Consola del Navegador
1. Abre tu app en el navegador: http://localhost:5173
2. Abre DevTools (F12)
3. Ve a la pestaña "Console"

### 3.2 Probar Extracción
1. Ve a **Admin** → **Extraer con IA**
2. Pega una URL de YouTube de un set
3. Click en **"Extraer con IA"**

### 3.3 Verificar Logs
Deberías ver en la consola:
```
🎵 Obteniendo token de Spotify...
✅ Token de Spotify obtenido
🎵 Enriqueciendo X tracks con Spotify...
🔍 Buscando en Spotify: "artist:Artist Name track:Track Name"
✅ Track encontrado: Track Name - Artist Name
📊 Datos enriquecidos: BPM=128, Key=8A, Energy=0.85
✅ Enriquecidos X/Y tracks
✅ BPM range actualizado con Spotify: 124-132
```

---

## Cómo Funciona

### Flujo de Extracción con Spotify

```
1. IA extrae tracklist básico (nombres de tracks y artistas)
   ↓
2. Para cada track:
   - Buscar en Spotify: "artist:X track:Y"
   - Obtener Spotify Track ID
   ↓
3. Para cada Track ID:
   - Obtener Audio Features
   - Extraer: tempo (BPM), key, mode, energy
   ↓
4. Convertir Key a formato Camelot:
   - Spotify: key=9, mode=0 → Camelot: "8A"
   - Spotify: key=2, mode=1 → Camelot: "10B"
   ↓
5. Actualizar tracklist con datos precisos
   ↓
6. Recalcular BPM range del set
```

### Tabla de Conversión Camelot

| Spotify Key | Note | Major (B) | Minor (A) |
|-------------|------|-----------|-----------|
| 0           | C    | 8B        | 5A        |
| 1           | C#   | 3B        | 12A       |
| 2           | D    | 10B       | 7A        |
| 3           | D#   | 5B        | 2A        |
| 4           | E    | 12B       | 9A        |
| 5           | F    | 7B        | 4A        |
| 6           | F#   | 2B        | 11A       |
| 7           | G    | 9B        | 6A        |
| 8           | G#   | 4B        | 1A        |
| 9           | A    | 11B       | 8A        |
| 10          | A#   | 6B        | 3A        |
| 11          | B    | 1B        | 10A       |

---

## Límites de la API

### Tier Gratuito (Client Credentials)
- **Rate Limit**: ~100 requests por minuto
- **Quota**: Sin límite diario
- **Costo**: Gratis

### Optimizaciones Implementadas
- **Batch Processing**: Procesa 5 tracks a la vez
- **Pausa entre batches**: 500ms para evitar rate limiting
- **Token Caching**: Reutiliza el token por 1 hora
- **Error Handling**: Continúa si un track falla

---

## Troubleshooting

### Error: "Spotify credentials no configuradas"
**Solución**: Verifica que `.env` tenga las variables correctas y reinicia el servidor.

### Error: "Spotify auth failed: 401"
**Solución**: 
- Verifica que Client ID y Secret sean correctos
- Asegúrate de no tener espacios extra en `.env`
- Regenera el Client Secret en Spotify Dashboard

### Error: "Track no encontrado en Spotify"
**Causa**: El track puede no estar en Spotify o el nombre es muy diferente.
**Solución**: La app continuará con los datos de la IA para ese track.

### Pocos tracks enriquecidos
**Causa**: Nombres de tracks muy diferentes entre 1001Tracklists y Spotify.
**Solución**: 
- Verifica que la IA esté extrayendo nombres correctos
- Considera implementar fuzzy matching en el futuro

---

## Ventajas vs. Alternativas

### ✅ Spotify API
- Datos oficiales y precisos
- API estable y bien documentada
- Gratuita y sin límites diarios
- Cobertura masiva de tracks

### ❌ Google Search + Scraping
- Datos inconsistentes
- Puede fallar si cambia el HTML
- Más lento
- Puede violar ToS

### ❌ Estimación por Género
- Muy impreciso
- No sirve para mezclas armónicas
- No refleja la realidad del track

---

## Próximos Pasos

Una vez configurado Spotify, puedes:
1. ✅ Extraer sets con BPM y Key precisos
2. ✅ Filtrar sets por rango de BPM
3. ✅ Identificar transiciones armónicas (Keys compatibles)
4. ✅ Analizar la curva de energía del set

---

## Recursos Adicionales

- **Spotify Web API Docs**: https://developer.spotify.com/documentation/web-api
- **Audio Features Reference**: https://developer.spotify.com/documentation/web-api/reference/get-audio-features
- **Camelot Wheel Guide**: https://mixedinkey.com/harmonic-mixing-guide/

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o consulta la documentación de Spotify.
