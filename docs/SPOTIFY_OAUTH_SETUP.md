# Spotify OAuth Setup - Authorization Code Flow

## ✅ Implementado

Hemos cambiado de Client Credentials Flow a **Authorization Code Flow** para poder usar Audio Features en Development Mode.

---

## 🔧 Configuración Necesaria

### Paso 1: Agregar Redirect URI en Spotify

1. Ve a tu app en Spotify Dashboard: https://developer.spotify.com/dashboard/36a8464a1a0c4bd6a5cd0d011ce81687

2. Click en **"Settings"** (botón en la esquina superior derecha)

3. Busca la sección **"Redirect URIs"**

4. Agrega esta URI:
   ```
   http://localhost:5173/callback
   ```

5. Click en **"Add"** y luego **"Save"**

---

## 🎯 Cómo Funciona

### Flujo de Autorización:

```
1. Admin hace click en "Conectar Spotify"
   ↓
2. Redirige a Spotify para autorizar
   ↓
3. Usuario autoriza la app
   ↓
4. Spotify redirige a /callback con código
   ↓
5. App intercambia código por tokens
   ↓
6. Tokens se guardan en localStorage
   ↓
7. App puede usar Audio Features
```

---

## 🚀 Uso

### Como Admin:

1. Ve a **Admin** en la navegación

2. Verás un banner amarillo: **"Spotify No Conectado"**

3. Click en **"Conectar Spotify"**

4. Autoriza la aplicación en Spotify

5. Serás redirigido de vuelta

6. El banner cambiará a verde: **"Spotify Conectado"**

7. Ahora puedes extraer sets con BPM y Key precisos

---

## 🔑 Tokens

### Almacenamiento:
- **Access Token**: Válido por 1 hora
- **Refresh Token**: Válido indefinidamente
- **Storage**: localStorage del navegador

### Refresh Automático:
- Si el token expira, se refresca automáticamente
- No necesitas volver a autorizar

### Cerrar Sesión:
- Click en **"Desconectar"** en el banner verde
- Elimina los tokens de localStorage

---

## 📊 Ventajas vs. Client Credentials

| Feature | Client Credentials | Authorization Code |
|---------|-------------------|-------------------|
| Requiere login | No | Sí (una vez) |
| Audio Features en Dev Mode | ❌ Bloqueado | ✅ Funciona |
| Configuración | Simple | Media |
| Tokens | 1 hora | 1 hora + refresh |

---

## 🧪 Testing

### Verificar que Funciona:

1. **Conectar Spotify**:
   - Ve a Admin
   - Click en "Conectar Spotify"
   - Autoriza
   - Verifica banner verde

2. **Extraer Set**:
   - Click en "Extraer con IA"
   - Pega URL de YouTube
   - Verifica en consola:
     ```
     🎵 Enriqueciendo tracks con Spotify API...
     🔍 Buscando en Spotify: "artist:X track:Y"
     ✅ Track encontrado: ...
     📊 Datos enriquecidos: BPM=128, Key=8A, Energy=0.85
     ```

3. **Verificar Datos**:
   - BPM Range no debe ser "0-0"
   - Tracks deben tener BPM numérico
   - Tracks deben tener Key en formato Camelot

---

## 🔧 Troubleshooting

### Error: "redirect_uri_mismatch"
**Causa**: La Redirect URI no está configurada en Spotify
**Solución**: Agrega `http://localhost:5173/callback` en Settings

### Error: "No estás autenticado con Spotify"
**Causa**: No has autorizado la app
**Solución**: Click en "Conectar Spotify" en Admin

### Error: "Token expirado"
**Causa**: El refresh token falló
**Solución**: Desconecta y vuelve a conectar Spotify

### No aparece el botón de Spotify
**Causa**: No estás en el Admin panel o no eres admin
**Solución**: Verifica que tu usuario tenga rol "admin"

---

## 📝 Variables de Entorno

Asegúrate de tener en tu `.env`:

```env
VITE_SPOTIFY_CLIENT_ID=36a8464a1a0c4bd6a5cd0d011ce81687
VITE_SPOTIFY_CLIENT_SECRET=aa1c17271e484a06b41b2b9f8bbcb667
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

---

## 🚀 Producción

Cuando publiques en Firebase:

1. Agrega la Redirect URI de producción en Spotify:
   ```
   https://set-finder-ceab2.web.app/callback
   ```

2. Actualiza `.env.production`:
   ```env
   VITE_SPOTIFY_REDIRECT_URI=https://set-finder-ceab2.web.app/callback
   ```

---

## ✅ Estado Actual

- ✅ OAuth Flow implementado
- ✅ Token storage en localStorage
- ✅ Refresh automático
- ✅ UI para conectar/desconectar
- ✅ Integración con extracción de IA

**Fecha**: 18 de Noviembre, 2025
**Estado**: Listo para uso
