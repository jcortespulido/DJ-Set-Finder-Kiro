# Solución al Error 403 de Spotify Audio Features

## 🔍 Diagnóstico del Problema

### Error Original
```
GET https://api.spotify.com/v1/audio-features/{id} 403 (Forbidden)
```

### ❌ Diagnóstico Incorrecto Inicial
Pensamos que necesitábamos **Extended Quota Mode** porque estábamos en Development Mode.

### ✅ Diagnóstico Correcto
El problema era que estábamos solicitando **scopes innecesarios** en la autenticación OAuth.

## 📚 Según la Documentación Oficial de Spotify

### Audio Features Endpoint
- **URL:** `GET /v1/audio-features/{id}`
- **Autenticación:** Requerida
- **Scopes requeridos:** **NINGUNO**
- **Disponible en Development Mode:** ✅ SÍ
- **Requiere Extended Quota:** ❌ NO

Fuente: https://developer.spotify.com/documentation/web-api/reference/get-audio-features

### Search Endpoint
- **URL:** `GET /v1/search`
- **Autenticación:** Requerida
- **Scopes requeridos:** **NINGUNO**
- **Disponible en Development Mode:** ✅ SÍ

Fuente: https://developer.spotify.com/documentation/web-api/reference/search

## 🐛 El Bug en Nuestro Código

### Código Anterior (INCORRECTO)
```typescript
const scopes = [
  'user-read-private',
  'user-read-email',
];
```

**Problema:** Estos scopes son para acceder a datos privados del usuario, lo cual:
1. No es necesario para Audio Features (son datos públicos de tracks)
2. Puede causar restricciones adicionales en Development Mode
3. Requiere que el usuario apruebe permisos innecesarios

### Código Nuevo (CORRECTO)
```typescript
// Audio Features y Search NO requieren scopes específicos
// Solo necesitamos autenticación básica
const params = new URLSearchParams({
  client_id: SPOTIFY_CLIENT_ID,
  response_type: 'code',
  redirect_uri: SPOTIFY_REDIRECT_URI,
  // No incluimos scope para usar solo endpoints públicos
  show_dialog: 'true',
});
```

## 🔧 Pasos para Aplicar la Solución

### 1. Desconectar Spotify en la App
1. Ve a la app: https://set-finder-ceab2.web.app
2. Ve al panel Admin
3. Click en "Desconectar Spotify"

### 2. Desplegar el Fix
```bash
npm run build
firebase deploy
```

### 3. Reconectar Spotify
1. Recarga la app
2. Click en "Conectar con Spotify"
3. Autoriza la app (ahora sin scopes innecesarios)
4. Prueba extraer un tracklist

### 4. Verificar
El endpoint de Audio Features debería funcionar ahora sin errores 403.

## 📊 Diferencias entre Scopes

### Scopes de Usuario (NO necesarios para nosotros)
- `user-read-private` - Leer perfil privado del usuario
- `user-read-email` - Leer email del usuario
- `user-library-read` - Leer biblioteca del usuario
- `playlist-read-private` - Leer playlists privadas

### Endpoints Públicos (NO requieren scopes)
- ✅ `/v1/search` - Buscar tracks, artistas, álbumes
- ✅ `/v1/audio-features/{id}` - Obtener BPM, Key, Energy
- ✅ `/v1/tracks/{id}` - Obtener info de un track
- ✅ `/v1/artists/{id}` - Obtener info de un artista

## 🎯 Conclusión

**NO necesitamos Extended Quota Mode.**

El error 403 era causado por solicitar scopes innecesarios que pueden tener restricciones adicionales en Development Mode. Al remover los scopes y usar solo autenticación básica, los endpoints públicos deberían funcionar correctamente.

## 🔗 Referencias

- [Spotify Web API Reference](https://developer.spotify.com/documentation/web-api/reference)
- [Audio Features Endpoint](https://developer.spotify.com/documentation/web-api/reference/get-audio-features)
- [Authorization Scopes](https://developer.spotify.com/documentation/web-api/concepts/scopes)
- [Quota Modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes)

## ⚠️ Nota Importante

Si después de aplicar este fix el error 403 persiste, entonces SÍ podría ser un problema de quota. Pero según la documentación oficial, Audio Features debería funcionar en Development Mode sin restricciones.
