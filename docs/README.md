# Documentación Set Finder

Índice completo de la documentación del proyecto.

## 📊 Estado y Progreso

- **[ESTADO_ACTUAL.md](./ESTADO_ACTUAL.md)** - Estado actual del proyecto, funcionalidades implementadas, problemas conocidos y roadmap completo
- **[PROGRESO_ACTUAL.md](./PROGRESO_ACTUAL.md)** - Historial de desarrollo y progreso de tareas
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Resumen general del proyecto
- **[TASK_1_COMPLETION_SUMMARY.md](./TASK_1_COMPLETION_SUMMARY.md)** - Resumen de completación de la primera tarea

## 🚀 Guías de Setup

### Configuración Inicial
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Guía de inicio rápido para desarrolladores
- **[SETUP_EN_PC_PERSONAL.md](./SETUP_EN_PC_PERSONAL.md)** - Guía de setup en PC personal

### Firebase
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Configuración completa de Firebase
- **[FIRESTORE_RULES_SUMMARY.md](./FIRESTORE_RULES_SUMMARY.md)** - Resumen de reglas de seguridad de Firestore
- **[MAKE_ADMIN.md](./MAKE_ADMIN.md)** - Cómo hacer un usuario administrador

### Autenticación
- **[GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md)** - Configuración de Google OAuth

### Spotify
- **[SPOTIFY_SETUP.md](./SPOTIFY_SETUP.md)** - Setup inicial de Spotify API
- **[SPOTIFY_OAUTH_SETUP.md](./SPOTIFY_OAUTH_SETUP.md)** - Configuración de OAuth de Spotify
- **[IMPLEMENTACION_SPOTIFY.md](./IMPLEMENTACION_SPOTIFY.md)** - Detalles técnicos de la implementación

## 🔧 Implementaciones Técnicas

### Extracción de Datos
- **[SOLUCION_BPM_KEY.md](./SOLUCION_BPM_KEY.md)** - Estrategia para obtener BPM y Key de tracks
- **[MEJORAS_BPM_YOUTUBE.md](./MEJORAS_BPM_YOUTUBE.md)** - Mejoras en extracción desde YouTube

### PWA
- **[PWA_ICONS_GUIDE.md](./PWA_ICONS_GUIDE.md)** - Guía para generar iconos PWA

## 🎯 Problemas Conocidos y Soluciones

### Spotify Audio Features
El endpoint de Audio Features de Spotify está bloqueado en Development Mode. Ver:
- [IMPLEMENTACION_SPOTIFY.md](./IMPLEMENTACION_SPOTIFY.md) - Sección "Problemas Conocidos"
- [SOLUCION_BPM_KEY.md](./SOLUCION_BPM_KEY.md) - Alternativas propuestas

**Solución:** Solicitar Extended Quota Mode en [Spotify Dashboard](https://developer.spotify.com/dashboard)

### Extracción de BPM/Key por IA
La IA no siempre puede extraer BPM y Key de fuentes públicas. Ver:
- [MEJORAS_BPM_YOUTUBE.md](./MEJORAS_BPM_YOUTUBE.md) - Mejoras implementadas
- [SOLUCION_BPM_KEY.md](./SOLUCION_BPM_KEY.md) - Estrategia completa

## 📋 Especificaciones del Proyecto

Las especificaciones completas están en `.kiro/specs/set-finder-app/`:
- `requirements.md` - Requisitos funcionales y no funcionales
- `design.md` - Documento de diseño técnico
- `tasks.md` - Plan de implementación detallado

## 🔗 Enlaces Útiles

- **App en producción:** https://set-finder-ceab2.web.app
- **Firebase Console:** https://console.firebase.google.com
- **Spotify Dashboard:** https://developer.spotify.com/dashboard
- **Google AI Studio:** https://aistudio.google.com

## 📝 Convenciones

- Los archivos en MAYÚSCULAS son documentación
- Los archivos con prefijo `SETUP_` son guías de configuración
- Los archivos con prefijo `IMPLEMENTACION_` son detalles técnicos
- Los archivos con prefijo `SOLUCION_` son estrategias para resolver problemas
