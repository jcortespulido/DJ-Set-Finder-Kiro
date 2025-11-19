# Solución: Extracción de BPM y Key

## Problema Identificado

La IA no está extrayendo BPM y Key de los tracks, resultando en:
- BPM Range: "0-0"
- Key: vacío ("-")

## Causa Raíz

El problema tiene dos causas principales:

### 1. **Prompt Poco Específico**
El prompt original pedía a la IA "buscar BPM y Key" pero no le daba instrucciones claras sobre:
- **Dónde** buscar exactamente (1001Tracklists, Set79)
- **Cómo** identificar estos datos
- **Qué hacer** si no los encuentra

### 2. **Google Search Grounding Limitado**
Google Search grounding de Gemini puede no estar accediendo efectivamente a las páginas de 1001Tracklists o Set79 para extraer los datos estructurados.

## Solución Implementada

### A. Prompt Mejorado y Más Específico

#### Antes:
```
- BPM: Beats por minuto (consulta bases de datos)
- Tono/Key: Clave Camelot (consulta 1001Tracklists o Beatport)
```

#### Ahora:
```
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
```

### B. Búsqueda Paso a Paso

Ahora el prompt incluye instrucciones paso a paso:

```
1. 🕵️ BÚSQUEDA DE LA FUENTE (PASO A PASO):
   - PASO 1: Busca en Google: "site:1001tracklists.com [artista] [evento]"
   - PASO 2: Si encuentras el tracklist, ÚSALO como fuente principal
   - PASO 3: Si no está, busca: "site:set79.com [artista] [evento]"
   - PASO 4: Para BPMs faltantes, busca cada track en Beatport
```

### C. URL de Búsqueda Directa

Nueva función que prepara la búsqueda en 1001Tracklists:

```typescript
async function search1001Tracklists(artist: string, event: string): Promise<string | null> {
  const query = `${artist} ${event}`.trim();
  const searchUrl = `https://www.1001tracklists.com/search/?query=${encodeURIComponent(query)}`;
  return searchUrl;
}
```

Esta URL se incluye en el prompt para que la IA la visite directamente.

### D. Cálculo Automático de BPM Range

Si la IA extrae BPMs individuales pero no calcula el range:

```typescript
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
  }
}
```

### E. Logging Detallado

Ahora se registra cuántos tracks tienen BPM y Key:

```typescript
console.log('📊 Datos extraídos por la IA:');
console.log('  - Tracks con BPM: ${tracksWithBpm}/${total}');
console.log('  - Tracks con Key: ${tracksWithKey}/${total}');
```

## Cómo Probar

### 1. Prueba con un Set Conocido

Usa un set que **sabemos** que está en 1001Tracklists:

```
URL: https://www.youtube.com/watch?v=ejemplo
Artista: Amelie Lens
Evento: Tomorrowland 2023
```

### 2. Verifica los Logs

Abre la consola del navegador (F12) y busca:
```
📺 Detectado video de YouTube: [id]
✅ Info de YouTube obtenida: { title, author }
🔍 Buscando en 1001Tracklists: "Amelie Lens Tomorrowland 2023"
📍 URL de búsqueda: https://www.1001tracklists.com/search/?query=...
💡 Sugerencia de búsqueda: [url]
📊 Datos extraídos por la IA:
  - Tracks con BPM: X/Y
  - Tracks con Key: X/Y
```

### 3. Verifica el Resultado

Después de la extracción, verifica:
- ✅ BPM Range no es "0-0"
- ✅ Al menos algunos tracks tienen BPM
- ✅ Al menos algunos tracks tienen Key (si están en 1001Tracklists)

## Limitaciones Conocidas

### 1. **Dependencia de Google Search Grounding**
- Gemini con Google Search puede tener limitaciones de acceso
- No todos los tracklists están en 1001Tracklists o Set79
- Algunos tracklists pueden estar desactualizados

### 2. **Rate Limits**
- Gemini 2.0 Flash Exp tiene límites estrictos en tier gratuito
- Si se alcanza el límite, esperar 1 minuto

### 3. **Calidad de Datos**
- Si el tracklist no está en 1001Tracklists/Set79, la IA puede:
  - Estimar BPMs basándose en el género
  - Dejar Keys en null
  - Usar datos de fuentes menos confiables

## Alternativas Futuras

### Opción 1: API Directa de 1001Tracklists
- Investigar si existe API oficial o no oficial
- Hacer scraping directo (con precaución por ToS)

### Opción 2: Base de Datos Local
- Mantener una base de datos de BPMs y Keys conocidos
- Usar servicios como Beatport API o Spotify API

### Opción 3: Análisis de Audio
- Usar Web Audio API para detectar BPM del audio
- Usar algoritmos de detección de tonalidad (Key)
- Requiere acceso al audio completo

### Opción 4: Crowdsourcing
- Permitir a usuarios editar y completar BPMs/Keys
- Sistema de votación para validar datos
- Gamificación para incentivar contribuciones

## Próximos Pasos

1. **Probar** la extracción con varios sets conocidos
2. **Monitorear** los logs para ver qué está encontrando la IA
3. **Ajustar** el prompt según los resultados
4. **Considerar** implementar una de las alternativas futuras

## Notas Técnicas

### Formato Camelot
El formato Camelot para Keys es:
- Números: 1-12 (representan la nota)
- Letras: A (menor) o B (mayor)
- Ejemplos: "8A", "10B", "1A"

### Compatibilidad Armónica
Keys compatibles en Camelot Wheel:
- Mismo número (8A ↔ 8B)
- +1/-1 número (8A ↔ 7A ↔ 9A)
- +7 número (8A ↔ 3A)

Esto es útil para futuros features de "mezclas armónicas".

---

**Estado**: Implementado y listo para testing
**Fecha**: 18 de Noviembre, 2025
