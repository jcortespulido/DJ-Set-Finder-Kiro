# Set Finder 🎧

Una Progressive Web App (PWA) para explorar, analizar y descubrir tracklists de sets de DJ con extracción automática usando IA.

## 🚀 Estado del Proyecto

**✅ FUNCIONAL Y DESPLEGADO** en Firebase Hosting

### Funcionalidades Core Implementadas:

- ✅ Autenticación con Google OAuth
- ✅ Extracción automática de tracklists con Gemini AI
- ✅ Integración con YouTube oEmbed API
- ✅ Búsqueda automática en 1001Tracklists
- ✅ Sistema de favoritos por usuario
- ✅ Filtros avanzados (artista, evento, género, BPM)
- ✅ UI responsive con diseño neón
- ✅ Integración con Spotify OAuth (búsqueda de tracks)
- ⚠️ Spotify Audio Features pendiente de Extended Quota Mode

📊 **Ver estado detallado:** [docs/ESTADO_ACTUAL.md](./docs/ESTADO_ACTUAL.md)

## 📁 Estructura del Proyecto

```
set-finder/
├── public/
│   ├── icons/              # Iconos PWA (pendiente generar PNG)
│   │   └── icon.svg        # Icono base SVG
│   └── robots.txt
├── src/
│   ├── components/         # Componentes React
│   ├── hooks/              # Custom hooks
│   │   └── useRegisterSW.ts
│   ├── services/           # Servicios (Firebase, API)
│   │   └── firebase.config.ts
│   ├── types/              # Definiciones TypeScript
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example            # Plantilla de variables de entorno
├── firebase.json           # Configuración Firebase
├── firestore.rules         # Reglas de seguridad Firestore
├── firestore.indexes.json  # Índices Firestore
├── storage.rules           # Reglas de seguridad Storage
├── vite.config.ts          # Configuración Vite + PWA
├── tailwind.config.js      # Configuración Tailwind CSS
├── tsconfig.json           # Configuración TypeScript
└── package.json

```

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage, Hosting, Functions)
- **PWA**: Vite PWA Plugin + Workbox
- **Routing**: React Router DOM
- **Offline**: IndexedDB (idb)

## 🚀 Quick Start

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales de Firebase, Gemini y Spotify
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Desplegar a Firebase**:
   ```bash
   npm run build
   firebase deploy
   ```

## 📋 Roadmap

### 🔥 Prioridad Alta
- [ ] Solicitar Extended Quota Mode a Spotify para Audio Features
- [ ] Implementar scraping de 1001Tracklists/Set79 como backup
- [ ] Arreglar icono PWA 144x144

### 📊 Prioridad Media
- [ ] Mejorar prompts de IA para mejor extracción de BPM/Key
- [ ] Edición manual de tracks (BPM, Key)
- [ ] Mejoras en búsqueda y filtros avanzados

### 💡 Prioridad Baja
- [ ] Dashboard con estadísticas
- [ ] Compartir sets públicamente
- [ ] Crear playlists en Spotify desde sets
- [ ] Optimizaciones de performance

**Ver roadmap completo:** [docs/ESTADO_ACTUAL.md](./docs/ESTADO_ACTUAL.md)

## 📚 Documentación

### Estado y Progreso
- [Estado Actual y Roadmap](./docs/ESTADO_ACTUAL.md) - Resumen completo del proyecto
- [Progreso Actual](./docs/PROGRESO_ACTUAL.md) - Historial de desarrollo

### Setup y Configuración
- [Getting Started](./docs/GETTING_STARTED.md) - Guía de inicio rápido
- [Firebase Setup](./docs/FIREBASE_SETUP.md) - Configuración de Firebase
- [Google Auth Setup](./docs/GOOGLE_AUTH_SETUP.md) - Configuración de autenticación
- [Spotify OAuth Setup](./docs/SPOTIFY_OAUTH_SETUP.md) - Configuración de Spotify
- [PWA Icons Guide](./docs/PWA_ICONS_GUIDE.md) - Generar iconos PWA

### Implementaciones Técnicas
- [Implementación Spotify](./docs/IMPLEMENTACION_SPOTIFY.md) - Detalles de integración Spotify
- [Solución BPM/Key](./docs/SOLUCION_BPM_KEY.md) - Estrategia para obtener BPM y Key
- [Mejoras BPM YouTube](./docs/MEJORAS_BPM_YOUTUBE.md) - Optimizaciones de extracción

### Especificaciones
- [Requirements](./kiro/specs/set-finder-app/requirements.md) - Requisitos funcionales
- [Design](./kiro/specs/set-finder-app/design.md) - Documento de diseño
- [Tasks](./kiro/specs/set-finder-app/tasks.md) - Plan de implementación

## 🎨 Tema Visual

La aplicación usa un tema de neón oscuro con los siguientes colores:

- **Fondo**: `#0d0a1d` (azul-negro muy oscuro)
- **Neón Cyan**: `#00f2ea` (color principal)
- **Neón Violet**: `#d15fff`
- **Neón Blue**: `#4df9ff`
- **Neón Red**: `#ff4747`
- **Neón Green**: `#39ff14`
- **Neón Orange**: `#ff8c00`
- **Neón Pink**: `#ff1493`

## 🔧 Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Previsualizar build de producción
npm run lint     # Ejecutar ESLint
```

## 📝 Notas

- El proyecto está configurado con TypeScript estricto
- Tailwind CSS está configurado con colores de neón personalizados
- PWA configurado con estrategias de caché optimizadas
- Firebase Security Rules ya están definidas
- Todos los tipos TypeScript base están creados

## 🔧 Tecnologías Clave

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Hosting)
- **IA**: Google Gemini 2.0 Flash (gemini-2.0-flash-exp)
- **APIs**: Spotify Web API, YouTube oEmbed API
- **PWA**: Vite PWA Plugin + Workbox

## 🤝 Contribuir

Este proyecto está en desarrollo activo. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

Desarrollado con ❤️ para la comunidad de DJs y amantes de la música electrónica.
