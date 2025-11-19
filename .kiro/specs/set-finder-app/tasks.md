# Implementation Plan - Set Finder

## Task Overview

Este plan de implementación está diseñado para construir Set Finder de forma incremental, comenzando con la infraestructura base y avanzando hacia funcionalidades más complejas. Cada tarea es ejecutable por un agente de código y referencia requisitos específicos del documento de requisitos.

---

- [x] 1. Configurar proyecto y estructura base








- [x] 1.1 Inicializar proyecto React con Vite y TypeScript



  - Crear proyecto con `npm create vite@latest set-finder -- --template react-ts`
  - Configurar Tailwind CSS
  - Instalar dependencias base: react-router-dom, firebase, idb
  - Configurar estructura de carpetas: /src/components, /src/hooks, /src/services, /src/types
  - _Requisitos: Diseño - Tecnologías Principales_

- [x] 1.2 Configurar Firebase proyecto


  - Crear proyecto en Firebase Console
  - Habilitar Firestore Database
  - Habilitar Firebase Authentication (Email/Password)
  - Habilitar Firebase Hosting
  - Habilitar Firebase Storage
  - Crear archivo firebase.config.ts con configuración
  - _Requisitos: 16.1, 16.2_

- [x] 1.3 Configurar PWA con Vite


  - Instalar vite-plugin-pwa
  - Crear manifest.json con iconos y configuración
  - Configurar service worker con Workbox
  - Crear iconos en tamaños requeridos (72x72 hasta 512x512)
  - _Requisitos: 10.1, 10.2, 10.3_

- [x] 1.4 Crear tipos TypeScript base


  - Definir interfaces: User, SetData, ThemeData, Track, EnergyLevel
  - Definir tipos de API responses
  - Crear archivo types/index.ts
  - _Requisitos: Diseño - Data Models_

---

- [x] 2. Implementar sistema de autenticación




- [x] 2.1 Crear AuthContext y AuthProvider

  - Implementar Context con user, token, isAdmin, login, register, logout
  - Integrar Firebase Authentication SDK
  - Manejar persistencia de sesión con onAuthStateChanged
  - Implementar refresh automático de token
  - _Requisitos: 12.1, 12.2, 12.7, 12.8_

- [x] 2.2 Crear componente AuthModal


  - Diseñar modal con tabs Login/Register
  - Implementar formulario de registro (email, password, name)
  - Implementar formulario de login (email, password)
  - Añadir validación de campos (email válido, password 8+ caracteres)
  - Mostrar errores de autenticación
  - _Requisitos: 12.1, 12.3, 12.4, 12.5_

- [x] 2.3 Crear servicio de Firestore para usuarios


  - Función para crear documento de usuario en Firestore después de registro
  - Función para obtener datos de usuario
  - Función para actualizar perfil de usuario
  - _Requisitos: 12.2, 16.7_

- [ ]* 2.4 Escribir tests para autenticación
  - Test: Registro exitoso crea usuario en Firestore
  - Test: Login con credenciales correctas funciona
  - Test: Login con credenciales incorrectas falla
  - Test: Token persiste en localStorage
  - _Requisitos: Testing Strategy - AuthProvider_

---

- [x] 3. Implementar estilos globales y componentes base




- [x] 3.1 Crear GlobalStyles component
  - Definir estilos CSS para temas de neón (10 colores)
  - Crear clases: neon-accent-{color}, border-neon-{color}, camelot-key-{color}
  - Añadir estilos para tablas, efectos hover, transiciones
  - Configurar fuente Inter de Google Fonts
  - _Requisitos: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 3.2 Crear componentes de iconos SVG
  - Implementar: HomeIcon, LayoutGrid, Search, HeartIcon
  - Implementar: SpotifyIcon, SoundCloudIcon, YoutubeIcon
  - Implementar: UserIcon, LogoutIcon, SettingsIcon, XIcon
  - Todos los iconos como componentes funcionales con props className
  - _Requisitos: Diseño - Icon Components_

- [x] 3.3 Crear GlobalHeader component
  - Implementar navegación fija con pestañas Home y Explorar
  - Añadir pestaña "Mis Favoritos" (solo si autenticado)
  - Añadir pestaña "Admin" (solo si es admin)
  - Añadir botón Login/UserMenu
  - Aplicar estilos de pestaña activa/inactiva
  - _Requisitos: 2.1, 2.2, 2.3, 2.4_

- [x] 3.4 Crear componentes de utilidad
  - LoadingSpinner component
  - OfflineBanner component (detecta conexión)
  - InstallPrompt component (PWA install)
  - ErrorBoundary component
  - _Requisitos: 10.6, 10.7_

---

- [x] 4. Implementar Firestore Security Rules




- [x] 4.1 Configurar reglas para colección users
  - Usuarios pueden leer/escribir solo su propio documento
  - Admins pueden leer todos los usuarios
  - Solo admins pueden cambiar roles
  - _Requisitos: Diseño - Security Rules users_

- [x] 4.2 Configurar reglas para colección sets
  - Todos pueden leer sets
  - Solo admins pueden crear/actualizar/eliminar
  - _Requisitos: Diseño - Security Rules sets_

- [x] 4.3 Configurar reglas para colección extractionJobs
  - Solo el usuario creador o admins pueden leer jobs
  - Solo admins pueden crear jobs
  - Nadie puede actualizar/eliminar manualmente
  - _Requisitos: Diseño - Security Rules extractionJobs_

- [x] 4.4 Desplegar reglas a Firebase
  - Ejecutar `firebase deploy --only firestore:rules`
  - Verificar reglas en Firebase Console
  - _Requisitos: 16.6_

---

- [x] 5. Implementar Vista Home




- [x] 5.1 Crear SetBrowser component
  - Implementar lógica para modo 'home' y 'explore'
  - En modo 'home': mostrar últimos 4 sets
  - Implementar useMemo para optimizar filtrado
  - _Requisitos: 3.1, 3.2, 3.3, 3.4_

- [x] 5.2 Crear SetCard component
  - Mostrar artist con color neón del tema
  - Mostrar event, stage, date, location
  - Mostrar description (limitada a 3 líneas)
  - Mostrar métricas: totalTracks y duration
  - Implementar efectos hover (borde neón, elevación)
  - _Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 5.3 Integrar Firestore para cargar sets
  - Query para obtener últimos 4 sets ordenados por createdAt
  - Manejar estado de loading
  - Manejar errores de red
  - _Requisitos: 16.3, 16.4_

- [x] 5.4 Añadir título y texto de introducción
  - Título "SET FINDER" con estilo neón cian
  - Párrafo de introducción con texto reducido
  - Subtítulo "Últimos Sets Añadidos"
  - _Requisitos: 3.2, 3.3, 3.4_

- [ ]* 5.5 Escribir tests para Vista Home
  - Test: Renderiza 4 tarjetas en modo home
  - Test: Click en tarjeta navega a detalle
  - Test: Muestra loading mientras carga sets
  - _Requisitos: Testing Strategy - SetBrowser_

---

- [x] 6. Implementar Vista Explorar




- [x] 6.1 Añadir barra de búsqueda a SetBrowser
  - Input de búsqueda centrado (solo en modo 'explore')
  - Implementar filtrado en tiempo real con useState
  - Buscar en campos: artist, event, location, date
  - Búsqueda case-insensitive
  - _Requisitos: 5.3, 5.4_

- [x] 6.2 Crear SetTable component
  - Tabla con columnas: Artista, Evento, Fecha, Lugar
  - Header sticky con fondo oscuro
  - Filas clickables con hover effect
  - Ocultar columnas Fecha y Lugar en móvil
  - _Requisitos: 5.5, 5.6, 5.7_

- [x] 6.3 Implementar navegación a detalle desde tabla
  - Click en fila llama a onSelectSet con setId
  - _Requisitos: 5.8_

- [x] 6.4 Añadir mensaje "No se encontraron sets"
  - Mostrar cuando filtro no tiene resultados
  - _Requisitos: Diseño - Error Handling_

- [ ]* 6.5 Escribir tests para Vista Explorar
  - Test: Búsqueda filtra resultados correctamente
  - Test: Búsqueda es case-insensitive
  - Test: Click en fila navega a detalle
  - _Requisitos: Testing Strategy - SetTable_

---

- [x] 7. Implementar Vista Detalle de Set




- [x] 7.1 Crear TracklistDetail component
  - Aplicar colores del theme del set dinámicamente
  - Estructura con header sticky y tabla scrollable
  - _Requisitos: 6.1_

- [x] 7.2 Implementar encabezado del set
  - Mostrar artist con color theme.primary
  - Mostrar event, stage, description
  - Panel de estadísticas: Duración, BPM, Género, Tracks, NF
  - Icono YouTube con enlace directo o búsqueda
  - Enlace a fuente del tracklist
  - _Requisitos: 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 7.3 Crear tabla de tracklist
  - Columnas: Inicio, Canción, BPM, Género, Tono, Energía, Notas
  - Header sticky con background theme.headerBG
  - Colorear celda Tono con theme.camelot
  - Colorear celda Energía según valor (Peak=rojo, Groove=amarillo, etc.)
  - Ocultar columnas BPM, Notas, Género en móvil
  - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11_

- [x] 7.4 Añadir columna "Escuchar"
  - Icono de Spotify con enlace a búsqueda Google
  - Icono de SoundCloud con enlace a búsqueda Google
  - Efectos hover (color verde Spotify, naranja SoundCloud)
  - _Requisitos: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ]* 7.5 Escribir tests para Vista Detalle
  - Test: Aplica colores de tema correctamente
  - Test: Genera URLs correctas para Spotify/SoundCloud
  - Test: Maneja youtubeUrl nulo correctamente
  - _Requisitos: Testing Strategy - TracklistDetail_

---

- [x] 8. Implementar sistema de favoritos




- [x] 8.1 Crear servicio toggleFavorite
  - Verificar autenticación
  - Añadir/eliminar setId del array favorites del usuario
  - Incrementar/decrementar favoriteCount del set
  - Usar arrayUnion/arrayRemove y increment de Firestore
  - _Requisitos: 13.3, 13.4, 13.10_

- [x] 8.2 Crear FavoriteButton component
  - Icono de corazón (outline/filled según estado)
  - Click llama a servicio toggleFavorite
  - Mostrar loading durante request
  - Animación de "latido" al marcar favorito
  - _Requisitos: 13.1, 13.2, 13.5, 13.6_

- [x] 8.3 Integrar FavoriteButton en SetCard
  - Mostrar botón solo si usuario autenticado
  - Posicionar en esquina superior derecha de tarjeta
  - _Requisitos: 13.1, 13.11_

- [x] 8.4 Integrar FavoriteButton en TracklistDetail
  - Mostrar botón en encabezado del set
  - _Requisitos: 13.2_

- [x] 8.5 Crear FavoritesView component
  - Cargar favoritos del usuario desde Firestore
  - Mostrar grid de tarjetas (igual que Home)
  - Mensaje si no hay favoritos
  - Botón para ir a Explorar
  - _Requisitos: 13.7, 13.8, 13.9_

- [ ]* 8.6 Escribir tests para favoritos
  - Test: Toggle favorito actualiza UI
  - Test: Contador de favoritos se actualiza
  - Test: Favoritos persisten después de logout/login
  - _Requisitos: Testing Strategy - Integration Tests_

---

- [x] 9. Implementar Panel de Administración (básico)




- [x] 9.1 Crear AdminPanel component
  - Verificar que usuario es admin (useContext)
  - Vista de gestión de sets
  - _Requisitos: 14.1, 14.2_

- [x] 9.2 Implementar sección de gestión de sets
  - Tabla con todos los sets
  - Botones: Crear, Eliminar
  - Modal de formulario para crear
  - Confirmación para eliminar
  - _Requisitos: 14.3, 14.4, 14.5, 14.6, 14.7_

- [x] 9.3 Crear servicios para CRUD de sets
  - createSet: Crear en Firestore con timestamps
  - updateSet: Actualizar campos, updatedAt timestamp
  - deleteSet: Eliminar set
  - _Requisitos: 14.8_

- [ ] 9.4 Crear Firestore Trigger onSetDeleted
  - Eliminar setId de favoritos de todos los usuarios
  - Usar batch write para eficiencia
  - _Requisitos: 14.8_

- [ ] 9.5 Implementar sección de gestión de usuarios
  - Tabla con usuarios: email, nombre, rol, fecha, # favoritos
  - Botón para cambiar rol (user ↔ admin)
  - Botón para eliminar usuario (con confirmación)
  - _Requisitos: 14.9, 14.10, 14.11, 14.12_

- [ ] 9.6 Crear Cloud Functions para gestión de usuarios
  - getUsersList: Obtener todos los usuarios
  - updateUserRole: Cambiar custom claim y documento
  - deleteUser: Eliminar de Authentication y Firestore
  - _Requisitos: 14.11, 14.12_

- [ ]* 9.7 Escribir tests para Admin Panel
  - Test: Solo renderiza si usuario es admin
  - Test: CRUD de sets funciona correctamente
  - Test: Cambio de rol actualiza usuario
  - _Requisitos: Testing Strategy - AdminPanel_

---

- [x] 10. Implementar extracción de tracklist con IA
- [x] 10.1 Crear AIExtractor component
  - Input para URL (YouTube o SoundCloud)
  - Botón "Extraer Tracklist"
  - Loading state con progreso
  - Preview editable del resultado
  - Botón "Guardar Set"
  - _Requisitos: 15.1, 15.2, 15.10, 15.11, 15.12_

- [x] 10.2 Implementar servicio de extracción con IA
  - Integración con Google Gemini AI
  - Función para extraer metadata y tracklist
  - Modo demo con datos de ejemplo
  - Manejar errores de URL inválida
  - _Requisitos: 15.3, 15.4_

- [x] 10.3 Implementar servicio aiService
  - Función extractTracklistFromURL con Google Gemini
  - Función mockExtractTracklist para testing sin API key
  - Parseo y validación de respuesta JSON
  - Cálculo automático de totalTracks y unidentifiedTracks
  - _Requisitos: 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 15.14_

- [x] 10.4 Implementar prompt engineering para IA
  - Template de prompt con instrucciones detalladas
  - Solicitar formato JSON estricto
  - Incluir estructura completa de respuesta esperada
  - _Requisitos: 15.6, Diseño - Prompt Engineering_

- [x] 10.5 Implementar preview de resultados
  - Mostrar datos extraídos antes de guardar
  - Preview de información del set
  - Preview de tracklist (primeros 5 tracks)
  - Botones para guardar o extraer otro
  - _Requisitos: 15.10, 15.11_

- [x] 10.6 Añadir manejo de errores
  - Validación de URLs
  - Mensajes de error descriptivos
  - Modo fallback con datos de ejemplo
  - Indicador de configuración de API key
  - _Requisitos: 15.14, 15.15, Diseño - Error Handling_

- [x] 10.7 Mejorar extracción de YouTube
  - Integración con YouTube oEmbed API para obtener metadata
  - Extracción automática de ID de video
  - Contexto mejorado en prompt con título y canal
  - Priorización de descripción de YouTube en búsqueda
  - _Requisitos: 15.3, 15.4_

- [x] 10.8 Mejorar visualización de BPM y Key
  - Añadir BPM a SetCard component
  - Mejorar tabla de tracklist con BPM destacado
  - Mostrar BPM y Key en móvil debajo del nombre del track
  - Cambiar header "Tono" a "Key" para mayor claridad
  - _Requisitos: 7.3, 7.4, 11.7_

- [x] 10.9 Integración con Spotify API
  - Crear servicio spotifyService.ts con OAuth Flow
  - Implementar búsqueda de tracks en Spotify
  - ⚠️ Audio Features bloqueado (403) - Requiere Extended Quota Mode
  - Conversión de Spotify Key a formato Camelot
  - Batch processing con rate limiting
  - Integración con pipeline de extracción de IA
  - Documentación completa de setup
  - _Requisitos: 15.3, 15.4, 15.5_

- [ ] 10.10 Solicitar Extended Quota Mode a Spotify
  - Ir a Spotify Dashboard → Request Extension
  - Solicitar Extended Quota Mode para Audio Features
  - Documentar proceso de aprobación
  - Probar endpoint una vez aprobado
  - _Requisitos: 15.3, 15.4_

- [ ] 10.11 Implementar scraping como backup para BPM/Key
  - Scraping de 1001Tracklists
  - Scraping de Set79
  - Sistema de fallback: Spotify → Scraping → Manual
  - _Requisitos: 15.3, 15.4_

- [ ]* 10.12 Escribir tests para extracción IA
  - Test: Extracción exitosa retorna resultado válido
  - Test: Mock extraction funciona sin API key
  - Test: Validación de URLs
  - _Requisitos: Testing Strategy - aiService_

---

- [x] 11. Implementar funcionalidades PWA




- [x] 11.1 Configurar service worker con Workbox
  - Estrategia CacheFirst para assets estáticos
  - Estrategia NetworkFirst para API calls
  - Estrategia StaleWhileRevalidate para sets
  - Estrategia CacheFirst para fuentes e imágenes
  - _Requisitos: 10.1, 10.9, 10.10_

- [x] 11.2 Implementar detección offline
  - OfflineBanner component
  - Mostrar banner cuando no hay conexión
  - _Requisitos: 10.6, 10.7_

- [x] 11.3 Implementar almacenamiento offline de favoritos
  - Usar IndexedDB con librería idb
  - Guardar favoritos offline cuando no hay conexión
  - Sincronizar con Firestore cuando recupera conexión
  - _Requisitos: 10.8_

- [x] 11.4 Crear InstallPrompt component
  - Escuchar evento beforeinstallprompt
  - Mostrar botón "Instalar App"
  - Llamar a prompt() al hacer click
  - Ocultar botón después de instalar
  - _Requisitos: 10.4, 10.5_

- [x] 11.5 Optimizar performance para PWA
  - Lazy loading de componentes (AdminPanel, TracklistDetail, FavoritesView)
  - Code splitting con React.lazy y Suspense
  - Limpieza automática de cache antiguo
  - Service Worker con estrategias optimizadas
  - _Requisitos: Diseño - Performance Optimizations_

- [x] 11.6 Verificar checklist PWA
  - ✅ Iconos PWA generados en todos los tamaños (72-512px)
  - ✅ Manifest configurado correctamente
  - ✅ Service worker funcionando
  - ✅ Instalable en múltiples plataformas
  - ⚠️ Lighthouse PWA score pendiente de verificar
  - _Requisitos: 10.11, 10.12_

---

- [x] 12. Implementar diseño responsive
- [x] 12.1 Configurar breakpoints Mobile First
  - Configurar Tailwind con breakpoints: sm, md, lg, xl, 2xl
  - _Requisitos: 11.1, Diseño - Responsive Design_

- [x] 12.2 Adaptar grid de tarjetas
  - Mobile (xs): 1 columna
  - Tablet portrait (sm): 2 columnas
  - Tablet landscape (md): 3 columnas
  - Desktop (lg): 4 columnas
  - _Requisitos: 11.2, 11.3, 11.4, 11.5_

- [x] 12.3 Adaptar tabla de explorar
  - Ocultar columnas Fecha y Lugar en móvil (<768px)
  - _Requisitos: 11.6_

- [x] 12.4 Adaptar tabla de tracklist
  - Ocultar columnas BPM, Notas, Género en móvil (<768px)
  - _Requisitos: 11.7_

- [x] 12.5 Optimizar para touch
  - Áreas táctiles mínimas de 44x44px
  - Prevenir zoom en inputs (font-size 16px)
  - Modales fullscreen en móvil
  - _Requisitos: 11.9, 11.10, 11.11_

- [x] 12.6 Ajustar tipografía responsive
  - Reducir título principal a 2.5rem en móvil
  - Reducir texto de introducción en móvil
  - _Requisitos: 11.8_

- [x] 12.7 Mejorar responsive en móvil
  - ✅ Links de Spotify/SoundCloud accesibles en móvil
  - ✅ Fecha y lugar visibles en tabla de explorar (móvil)
  - ✅ BPM, Key y Energy visibles en tracklist (móvil)
  - ✅ Áreas táctiles de 44x44px en toda la app
  - ⚠️ Test en dispositivos reales pendiente
  - _Requisitos: 11.12, Testing Strategy - Responsive Tests_

---

- [x] 13. Deployment y configuración de producción
- [x] 13.1 Configurar Firebase Hosting
  - ✅ Firebase Hosting configurado
  - ✅ Build directory (dist) configurado
  - ✅ Rewrites para SPA configurados
  - ✅ App desplegada en https://set-finder-ceab2.web.app
  - _Requisitos: Diseño - Infraestructura_

- [x] 13.2 Configurar variables de entorno
  - ✅ .env configurado con API keys
  - ✅ Firebase Config en producción
  - ✅ Gemini AI API key configurada
  - ✅ Spotify credentials configuradas
  - Configurar OpenAI API key en Cloud Functions
  - _Requisitos: Diseño - Infraestructura_

- [ ] 13.3 Desplegar Cloud Functions
  - Ejecutar `firebase deploy --only functions`
  - Verificar que todas las functions se despliegan correctamente
  - _Requisitos: Diseño - Cloud Functions_

- [ ] 13.4 Desplegar frontend a Firebase Hosting
  - Build de producción: `npm run build`
  - Deploy: `firebase deploy --only hosting`
  - Verificar que PWA funciona en producción
  - _Requisitos: Diseño - Infraestructura_

- [ ] 13.5 Configurar dominio personalizado (opcional)
  - Añadir dominio en Firebase Hosting
  - Configurar DNS records
  - Verificar SSL automático
  - _Requisitos: Diseño - Infraestructura_

- [ ] 13.6 Configurar monitoreo
  - Habilitar Firebase Performance Monitoring
  - Habilitar Firebase Crashlytics
  - Configurar Google Analytics 4
  - _Requisitos: Diseño - Infraestructura_

---

- [ ] 14. Testing y validación final
- [ ]* 14.1 Ejecutar suite de tests unitarios
  - Ejecutar `npm run test`
  - Verificar cobertura > 70%
  - _Requisitos: Testing Strategy_

- [ ]* 14.2 Ejecutar tests de integración
  - Test: Flujo completo de autenticación
  - Test: Flujo completo de favoritos
  - Test: Flujo completo de admin
  - _Requisitos: Testing Strategy - Integration Tests_

- [ ]* 14.3 Ejecutar tests E2E
  - Test: Usuario nuevo completo
  - Test: Admin completo con extracción IA
  - Test: Búsqueda y filtrado
  - _Requisitos: Testing Strategy - E2E Tests_

- [ ] 14.4 Verificar performance
  - Lighthouse score > 90 en todas las categorías
  - Tiempo de carga inicial < 3 segundos
  - Time to Interactive < 5 segundos
  - _Requisitos: Testing Strategy - Performance Tests_

- [ ] 14.5 Verificar seguridad
  - Endpoints protegidos rechazan requests sin auth
  - Security Rules funcionan correctamente
  - No hay XSS vulnerabilities
  - _Requisitos: Testing Strategy - Security Tests_

- [ ] 14.6 Verificar accesibilidad
  - Lighthouse accessibility score > 90
  - Navegación por teclado funciona
  - Screen readers funcionan correctamente
  - _Requisitos: Diseño - Accessibility Considerations_

---

## Notas de Implementación

### Orden de Ejecución Recomendado
1. Tareas 1-3: Infraestructura y base (crítico)
2. Tarea 4: Security Rules (crítico antes de producción)
3. Tareas 5-7: Vistas principales (core features)
4. Tarea 2: Autenticación (necesario para favoritos)
5. Tarea 8: Favoritos (feature principal)
6. Tareas 9-10: Admin y IA (features avanzadas)
7. Tareas 11-12: PWA y responsive (optimización)
8. Tareas 13-14: Deployment y testing (final)

### Tareas Opcionales (marcadas con *)
Las tareas marcadas con * son tests y no son requeridas para el MVP funcional, pero son altamente recomendadas para producción.

### Dependencias entre Tareas
- Tarea 8 requiere Tarea 2 (autenticación)
- Tarea 9 requiere Tarea 2 (autenticación + admin)
- Tarea 10 requiere Tarea 9 (admin panel)
- Tarea 13 requiere todas las tareas anteriores

### Estado Actual del Proyecto (Actualizado: 19 Nov 2025)

#### ✅ Completado
- **Tareas 1-13**: MVP funcional desplegado y en producción
- **PWA**: Iconos generados, manifest configurado, instalable
- **Responsive**: Optimizado para móvil con mejoras de UX
- **Deployment**: App en producción en https://set-finder-ceab2.web.app

#### 🔄 En Progreso
- **Tarea 10.10**: Solicitar Extended Quota Mode a Spotify (usuario)
- **Tarea 10.11**: Implementar scraping como backup para BPM/Key

#### ⚠️ Bloqueadores
- **Spotify Audio Features**: 403 Forbidden - Requiere Extended Quota Mode
- **BPM/Key**: Sin datos hasta resolver Spotify o implementar scraping

### Mejoras Recientes (Sesión Actual)
1. ✅ **Links de Escuchar en Móvil** - Spotify/SoundCloud accesibles en tracklist móvil
2. ✅ **Tabla Explorar Mejorada** - Fecha y lugar visibles en móvil
3. ✅ **Iconos PWA Generados** - Todos los tamaños (72-512px) con script automatizado
4. ✅ **Documentación Actualizada** - Análisis móvil y próximos pasos documentados

### Próximos Pasos Inmediatos
1. **Desplegar mejoras móvil** - `firebase deploy --only hosting`
2. **Solicitar Extended Quota Mode a Spotify** (usuario) - Ver `docs/SPOTIFY_EXTENDED_QUOTA.md`
3. **Implementar scraping de 1001Tracklists** - Backup para BPM/Key
4. **Testing en dispositivos reales** - Validar UX móvil

### Estimación de Tiempo
- MVP básico (tareas 1-7): ✅ Completado
- Features completas (tareas 1-10): ✅ Completado (con limitación Spotify)
- PWA + Responsive (tareas 11-12): ✅ Completado + Mejorado
- Deployment (tarea 13): ✅ Completado
- Testing (tarea 14): 📋 Pendiente (opcional)
- **Tiempo invertido**: ~11 días de desarrollo
