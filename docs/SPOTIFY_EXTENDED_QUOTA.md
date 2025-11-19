# Solicitar Extended Quota Mode en Spotify

## 🎯 Objetivo

Obtener acceso al endpoint `/audio-features` de Spotify API que actualmente retorna 403 Forbidden debido a las limitaciones de Development Mode.

## 📋 Pasos para Solicitar

### 1. Acceder al Dashboard de Spotify

1. Ve a [Spotify for Developers Dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Selecciona tu aplicación "Set Finder" (o como la hayas nombrado)

### 2. Solicitar Extension

1. En el dashboard de tu app, busca el botón **"Request Extension"**
2. Selecciona **"Extended Quota Mode"**
3. Completa el formulario con la siguiente información:

### 3. Información para el Formulario

**Nombre de la aplicación:**
```
Set Finder
```

**Descripción del proyecto:**
```
Set Finder es una Progressive Web App que permite a DJs y amantes de la música 
electrónica descubrir, explorar y guardar tracklists de sets de DJ. La aplicación 
utiliza IA para extraer automáticamente tracklists desde YouTube y enriquece los 
datos con información de Spotify.
```

**¿Por qué necesitas Extended Quota Mode?**
```
Necesitamos acceso al endpoint de Audio Features (/v1/audio-features/{id}) para 
obtener información técnica de las canciones (BPM, Key, Energy) y proporcionar 
una mejor experiencia a nuestros usuarios al mostrar datos precisos de cada track 
en los sets de DJ.

Actualmente, la aplicación puede buscar tracks pero no puede obtener sus 
características de audio debido a las restricciones de Development Mode.
```

**Casos de uso específicos:**
```
1. Extracción automática de tracklists desde YouTube usando IA
2. Enriquecimiento de tracks con datos de Spotify (BPM, Key, Energy)
3. Filtrado de sets por rango de BPM
4. Visualización de información técnica para DJs
5. Análisis de compatibilidad armónica entre tracks (Camelot Wheel)
```

**Número estimado de usuarios:**
```
100-500 usuarios en los primeros 3 meses
```

**Volumen de requests esperado:**
```
- Búsqueda de tracks: ~1000 requests/día
- Audio Features: ~1000 requests/día
- Total: ~2000 requests/día
```

### 4. Información Adicional

**URL de la aplicación:**
```
https://set-finder-ceab2.web.app
```

**Endpoints que necesitas:**
- ✅ `/v1/search` - Ya funciona
- ⚠️ `/v1/audio-features/{id}` - Bloqueado (403)
- ⚠️ `/v1/audio-features` (batch) - Bloqueado (403)

### 5. Después de Enviar

1. Spotify revisará tu solicitud (puede tomar varios días)
2. Recibirás un email con la decisión
3. Si es aprobado, el endpoint funcionará automáticamente
4. Si es rechazado, puedes apelar o implementar alternativas

## 🔄 Alternativas Mientras Esperas

Mientras esperas la aprobación, puedes:

1. **Implementar scraping** de 1001Tracklists/Set79
2. **Permitir edición manual** de BPM y Key
3. **Usar datos de IA** cuando estén disponibles en las fuentes

## 📝 Notas

- El proceso de aprobación puede tomar de 3 a 14 días
- Spotify puede solicitar más información
- Asegúrate de que tu app cumple con los [Terms of Service](https://developer.spotify.com/terms)
- No uses los datos de Spotify para entrenar modelos de IA

## 🔗 Enlaces Útiles

- [Spotify Dashboard](https://developer.spotify.com/dashboard)
- [Spotify API Documentation](https://developer.spotify.com/documentation/web-api)
- [Rate Limits](https://developer.spotify.com/documentation/web-api/concepts/rate-limits)
- [Quota Extension Guide](https://developer.spotify.com/documentation/web-api/concepts/quota-modes)
